"use client";
import { api } from "@workspace/backend/_generated/api";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { usePaginatedQuery } from "convex/react";
import {
  FileIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { uploadDialog, uploadDialog as UploadDialog } from "../components/upload-dialog";
import { DeleteFileDialog } from "../components/delete-file-dialog";
import { PublicFile } from "@workspace/backend/private/files";

export const FilesView = () => {
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    {
      initialNumItems: 10,
    },
  );

  const {
    topElementRef,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
    handleLoadMore,
  } = useInfiniteScroll({
    status: files.status,
    loadMore: files.loadMore,
    loadsize: 10,
  });

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null); 
  const handleDeleteClick = (file: PublicFile) => {
    setSelectedFile(file);
    setDeleteDialogOpen(true);
  }
  const handleFileDeleted = () => {
    setSelectedFile(null);
  }

  return (
    <>
    <DeleteFileDialog
    onOpenChange={setDeleteDialogOpen}
    open={deleteDialogOpen}
    file={selectedFile}
    onDeleted={handleFileDeleted}
    />
      <UploadDialog
        onOpenChange={setIsUploadDialogOpen}
        open={isUploadDialogOpen}
        onFileUploaded={() => {
          setIsUploadDialogOpen(false);
        }}
      />

      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className=" mx-auto w-full max-w-screen-md">
          <div className=" space-y-2">
            <h1>Knowledge Base</h1>
            <p className="text-sm text-muted-foreground">
              Upload and manage documents for your AI assistant
            </p>
          </div>
          <div className="mt-6 rounded-lg border bg-background">
            <div className="flex items-center justify-end border-b px-6 py-4">
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <PlusIcon />
                Add File
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Name</TableHead>
                  <TableHead className="px-6 py-4">Type</TableHead>
                  <TableHead className="px-6 py-4">Size</TableHead>
                  <TableHead className="px-6 py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  if (isLoadingFirstPage) {
                    return (
                      <TableRow>
                        <TableCell className="h-24 text-center" colSpan={4}>
                          Loading files...
                        </TableCell>
                      </TableRow>
                    );
                  }
                  if (files.results.length === 0) {
                    return (
                      <TableRow>
                        <TableCell className="h-24 text-center" colSpan={4}>
                          No files found.
                        </TableCell>
                      </TableRow>
                    );
                  }
                  return files.results.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileIcon className="text-muted-foreground" />
                          {file.name}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className="uppercase" variant="outline">
                          {file.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">{file.size}</TableCell>
                      <TableCell className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="size-8 p-0"
                              variant="ghost"
                              size="sm"
                            >
                              <MoreHorizontalIcon className=""></MoreHorizontalIcon>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {handleDeleteClick(file)}}

                            >
                              <TrashIcon className="size-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>
            {!isLoadingFirstPage && files.results.length > 0 && (
              <div className="border-t">
                <InfiniteScrollTrigger
                  canLoadMore={canLoadMore}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMore}
                  ref={topElementRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

"use client";

import { useState } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import {
  FileText,
  Download,
  UploadCloud,
  Folder,
  Trash2,
  X,
} from "lucide-react";

export function DocumentsClient({ isAdmin }: { isAdmin: boolean }) {
  const [documents, setDocuments] = useState([
    {
      id: "1",
      title: "Building Rules & Regulations",
      category: "Rules",
      uploaded_by: { name: "Sarah Admin" },
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Q1 Financial Report",
      category: "Financial reports",
      uploaded_by: { name: "Sarah Admin" },
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      title: "Annual Assembly Minutes 2025",
      category: "Meeting reports",
      uploaded_by: { name: "Bob Admin" },
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "Rules" });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleDownload = (title: string) => {
    // Fake download interaction
    alert(`Downloading: ${title}.pdf`);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newDoc = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      category: formData.category,
      uploaded_by: { name: "Sarah Admin" }, // mock
      created_at: new Date().toISOString(),
    };

    setDocuments([newDoc, ...documents]);
    setIsModalOpen(false);
    setFormData({ title: "", category: "Rules" });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isAdmin ? "Manage Documents" : "My Documents"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Important building files and reports.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            Upload Document
          </Button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {documents.length === 0 ? (
          <div className="col-span-3 text-center py-16">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-foreground">
              No documents found
            </h3>
          </div>
        ) : (
          documents.map((doc) => (
            <Card
              key={doc.id}
              className="p-6 hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  <Folder className="w-3 h-3" />
                  {doc.category}
                </span>
              </div>

              <h3 className="font-bold text-foreground line-clamp-2 min-h-[3rem] mb-4 flex-1">
                {doc.title}
              </h3>

              <div className="pt-4 border-t border-border/50 flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>
                    Added: {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(doc.title)}
                      className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {isAdmin && <span>By: {doc.uploaded_by.name}</span>}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Upload Modal (Admin Only) */}
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm p-6 bg-card border-border shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Upload Document
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Q2 Financial Report"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required>
                  <option value="Rules">Rules</option>
                  <option value="Financial reports">Financial reports</option>
                  <option value="Meeting reports">Meeting reports</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 border-border transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                      <UploadCloud className="w-8 h-8 mb-2" />
                      <p className="text-sm">
                        <span className="font-semibold">Click to upload</span>{" "}
                        PDF or DOCX
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      required
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload File</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

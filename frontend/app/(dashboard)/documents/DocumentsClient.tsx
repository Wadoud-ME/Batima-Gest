"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import { FileText, Download, UploadCloud, Folder, Trash2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Document {
  id: string; title: string; category: string; file_url: string;
  created_at: string; uploaded_by: string;
  users: { name: string | null } | null;
}

export function DocumentsClient({ isAdmin, userId }: { isAdmin: boolean; userId: string }) {
  const supabase = createClient();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "Rules" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [docToDelete, setDocToDelete] = useState<{ id: string; title: string } | null>(null);
  const [mounted, setMounted] = useState(() => typeof window !== "undefined");

  const fetchDocuments = useCallback(async () => {
    const { data, error } = await supabase.from("documents").select("*, users(name)").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load documents"); console.error(error); }
    else setDocuments(data as unknown as Document[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const confirmDelete = async () => {
    if (!docToDelete) return;
    const { error } = await supabase.from("documents").delete().eq("id", docToDelete.id);
    if (error) { toast.error("Failed to delete document"); console.error(error); }
    else { toast.info("Document deleted"); fetchDocuments(); }
    setDocToDelete(null);
  };

  const handleDownload = (doc: Document) => {
    if (doc.file_url) {
      const a = document.createElement("a");
      a.href = doc.file_url;
      a.download = doc.title.includes('.') ? doc.title : `${doc.title}.pdf`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      toast.error("No file available for download");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !selectedFile) { toast.error("Please provide a title and file"); return; }
    setSaving(true);

    // Upload file to Supabase Storage
    const fileExt = selectedFile.name.split('.').pop();
    const filePath = `${Date.now()}-${formData.title.replace(/\s+/g, '_')}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from("documents").upload(filePath, selectedFile);

    if (uploadError) { toast.error("File upload failed: " + uploadError.message); setSaving(false); return; }

    const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(filePath);

    const { error } = await supabase.from("documents").insert({
      title: formData.title,
      category: formData.category as "Rules" | "Financial reports" | "Meeting reports",
      file_url: publicUrl,
      uploaded_by: userId,
    });

    if (error) { toast.error("Failed to save document record"); console.error(error); }
    else { toast.success("Document uploaded successfully"); fetchDocuments(); }

    setSaving(false); setIsModalOpen(false);
    setFormData({ title: "", category: "Rules" }); setSelectedFile(null);
  };

  const cV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const iV = { hidden: { opacity: 0, scale: 0.95, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <motion.div variants={cV} initial="hidden" animate="show" className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isAdmin ? "Manage Documents" : "My Documents"}</h1>
          <p className="text-muted-foreground mt-2">Important building files and reports.</p>
        </div>
        {isAdmin && <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2"><UploadCloud className="h-4 w-4" /> Upload Document</Button>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {documents.length === 0 ? (
          <div className="col-span-3 text-center py-16"><FileText className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" /><h3 className="font-semibold text-foreground">No documents found</h3></div>
        ) : (
          documents.map((doc) => (
            <motion.div variants={iV} key={doc.id}>
              <Card className="p-6 hover:shadow-xl transition-all duration-300 group flex flex-col h-full bg-card/60 backdrop-blur-xl border-border/40">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl"><FileText className="h-6 w-6" /></div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"><Folder className="w-3 h-3" />{doc.category}</span>
                </div>
                <h3 className="font-bold text-foreground line-clamp-2 min-h-[3rem] mb-4 flex-1">{doc.title}</h3>
                <div className="pt-4 border-t border-border/50 flex flex-col gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Added: {new Date(doc.created_at).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      {isAdmin && <Button variant="ghost" size="icon" onClick={() => setDocToDelete({ id: doc.id, title: doc.title })} className="h-8 w-8 text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4" /></Button>}
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)} className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors"><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  {isAdmin && <span>By: {doc.users?.name || "Unknown"}</span>}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {isModalOpen && isAdmin && mounted && createPortal(
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="w-full max-w-md p-7 bg-card border-border/50 shadow-2xl rounded-3xl relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Upload Document</h2>
                <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="title">Document Title</Label><Input id="title" placeholder="e.g., Q2 Financial Report" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
                <div className="space-y-2"><Label htmlFor="category">Category</Label>
                  <select id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" required>
                    <option value="Rules">Rules</option><option value="Financial reports">Financial reports</option><option value="Meeting reports">Meeting reports</option>
                  </select>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 border-border transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                        <UploadCloud className="w-8 h-8 mb-2" />
                        <p className="text-sm">{selectedFile ? selectedFile.name : <><span className="font-semibold">Click to upload</span> PDF or DOCX</>}</p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} required />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" className="rounded-xl" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="rounded-xl shadow-md">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Upload File</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>, document.body
      )}

      {docToDelete && mounted && createPortal(
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-card text-card-foreground w-full max-w-md rounded-3xl shadow-2xl p-7 border border-border/50 relative">
              <button onClick={() => setDocToDelete(null)} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
              <h2 className="text-2xl font-bold pr-8">Delete Document</h2>
              <div className="py-6"><p className="text-muted-foreground leading-relaxed">Are you sure you want to permanently delete <strong>{docToDelete.title}</strong>? This action cannot be undone.</p></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setDocToDelete(null)} className="rounded-xl">Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete} className="rounded-xl shadow-md border border-destructive/40">Confirm Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>, document.body
      )}
    </motion.div>
  );
}

import "./PDFManager.scss";
import { useState, useEffect, useRef } from "react";
import { Button } from "../Ui/Button/Button";
import { Modal } from "../Ui/Modal/Modal";
import { apiClient } from "../../api/httpClient";

interface PDFDocument {
  id: string;
  filename: string;
  // A API pode retornar outras propriedades como size, uploaded_at, etc.
}

export function PDFManager() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPDFs = async () => {
    setLoading(true);

    const response = await apiClient.get("files");

    setPdfs(response.data);

    setLoading(false);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }

      await apiClient.post("/files/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await loadPDFs();
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      setUploading(false);
    }
  };

  const handleDelete = async (pdfId: string, pdfName: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${pdfName}"?`)) return;

    try {
      await apiClient.delete(`/files/${pdfId}`);

      loadPDFs();
    } catch (error) {
      console.error("Erro ao excluir PDF:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    handleUpload(e.dataTransfer.files);
  };

  const openModal = () => {
    setIsOpen(true);
    loadPDFs();
  };

  useEffect(() => {
    if (isOpen) {
      loadPDFs();
    }
  }, [isOpen]);

  return (
    <>
      <Button onClick={openModal} variant="secondary">
        Gerenciar PDFs
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Gerenciador de PDFs"
        size="lg"
      >
        <div className="pdf-manager">
          <div
            className="pdf-upload-area"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📄</div>
            <h4>Arraste PDFs aqui ou clique para selecionar</h4>
            <p>Suporte para múltiplos arquivos PDF</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              onChange={(e) => handleUpload(e.target.files)}
              style={{ display: "none" }}
            />
          </div>

          <div className="pdf-list">
            <h4>Documentos Carregados ({pdfs.length})</h4>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Carregando documentos...</p>
              </div>
            ) : pdfs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p>Nenhum documento PDF encontrado</p>
              </div>
            ) : (
              <div className="pdf-items">
                {pdfs.map((pdf) => (
                  <div key={pdf.id} className="pdf-item">
                    <div className="pdf-info">
                      <div className="pdf-name">{pdf.filename}</div>
                      <div className="pdf-actions">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(pdf.id, pdf.filename)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {uploading && (
              <div className="uploading-state">
                <div className="loading-spinner"></div>
                <p>Fazendo upload dos arquivos...</p>
              </div>
            )}
          </div>

          <div className="pdf-actions-footer">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

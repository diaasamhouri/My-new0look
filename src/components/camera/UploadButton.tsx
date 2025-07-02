import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  onFileUpload: (file: File) => void;
}

export const UploadButton = ({ onFileUpload }: UploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <>
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="confidence"
        className="w-full py-6 text-lg"
      >
        <Upload className="w-6 h-6 mr-3" />
        Upload Existing Photo
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};
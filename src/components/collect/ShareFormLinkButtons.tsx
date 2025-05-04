
import React from "react";
import { Copy, Check, ExternalLink, Trash2, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmbedCodeDialog from "@/components/common/EmbedCodeDialog";
import { generateFormEmbedCode } from "@/utils/embedCodeUtils";

interface ShareFormLinkButtonsProps {
  copied: boolean;
  onCopy: () => void;
  onOpenInNewTab: () => void;
  onRevoke: () => void;
  isRevoking: boolean;
  formId: string;
}

const ShareFormLinkButtons: React.FC<ShareFormLinkButtonsProps> = ({ 
  copied, 
  onCopy, 
  onOpenInNewTab,
  onRevoke,
  isRevoking,
  formId
}) => {
  const embedCode = generateFormEmbedCode(formId);
  
  return (
    <>
      <Button 
        onClick={onCopy} 
        variant="outline" 
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy public submission link
          </>
        )}
      </Button>
      <Button
        onClick={onOpenInNewTab}
        variant="outline"
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <ExternalLink className="h-4 w-4" />
        Open in new tab
      </Button>
      
      <EmbedCodeDialog
        code={embedCode}
        title="Embed Story Form"
        description="Copy this code to embed the story submission form on your website."
        trigger={
          <Button
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Code className="h-4 w-4" />
            Embed Form
          </Button>
        }
      />
      
      <Button
        onClick={onRevoke}
        variant="destructive"
        className="flex items-center gap-2 w-full sm:w-auto"
        disabled={isRevoking}
      >
        {isRevoking ? (
          "Revoking..."
        ) : (
          <>
            <Trash2 className="h-4 w-4" />
            Revoke link
          </>
        )}
      </Button>
    </>
  );
};

export default ShareFormLinkButtons;

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/src/components/ui/dialog";
import { Eye, EyeOff, Lock } from "lucide-react";
import { myToast } from "@/src/components/ui/toast";
import { updatePasswordAction } from "@/src/app/[locale]/actions/profile";
import type { PasswordChangeModalProps } from "@/src/components/account/types";

const PasswordChangeModal = ({ onUnauthorized }: PasswordChangeModalProps) => {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (newPassword.length < 6) {
      myToast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      myToast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const result = await updatePasswordAction(newPassword);
      if (!result.success) {
        if (result.error === "Non authentifié" && onUnauthorized) {
          onUnauthorized();
          return;
        }
        myToast.error(result.error);
        return;
      }
      myToast.success("Mot de passe modifié avec succès !");
      setNewPassword("");
      setConfirmPassword("");
      setOpen(false);
    } catch {
      myToast.error("Erreur lors du changement de mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setNewPassword(""); setConfirmPassword(""); } }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Lock className="h-4 w-4 mr-1.5" />
          Changer le mot de passe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Changer le mot de passe</DialogTitle>
          <DialogDescription>Entrez votre nouveau mot de passe ci-dessous.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="modal-new-pw">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="modal-new-pw"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                maxLength={72}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute hover:bg-transparent cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-8 w-8"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-confirm-pw">Confirmer le mot de passe</Label>
            <Input
              id="modal-confirm-pw"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              maxLength={72}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={loading || !newPassword}>
            {loading ? "Modification..." : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeModal;

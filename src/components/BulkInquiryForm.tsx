import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Product } from "@/data/products";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Mail, User, Phone, Building, MessageSquare, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

interface BulkInquiryFormProps {
  selectedProducts: Product[];
  onClose: () => void;
  open: boolean;
}

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits"),
  company: z.string().trim().max(200, "Company name must be less than 200 characters").optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
});

const BulkInquiryForm: React.FC<BulkInquiryFormProps> = ({
  selectedProducts,
  onClose,
  open,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      inquirySchema.parse(formData);

      setIsSubmitting(true);

      // Prepare the inquiry message
      const productList = selectedProducts.map((p) => `- ${p.name} (${p.category})`).join("\n");
      const fullMessage = `Products of Interest:\n${productList}\n\nMessage:\n${formData.message}`;

      // Create WhatsApp message
      const whatsappMessage = encodeURIComponent(
        `*Bulk Inquiry from ${formData.name}*\n\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `${formData.company ? `Company: ${formData.company}\n` : ''}` +
        `\n${fullMessage}`
      );

      // Open WhatsApp (replace with your WhatsApp business number)
      const whatsappNumber = "919876543210"; // Replace with actual number
      window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank");

      toast.success("Inquiry submitted successfully! Redirecting to WhatsApp...");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).errors.forEach((err: any) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error("Please fix the errors in the form");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (selectedProducts.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-xl bg-background/95 border-brand-accent/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-brand-accent">
            Bulk Product Inquiry
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Request information or quotes for {selectedProducts.length} selected products
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6 p-4 bg-secondary/50 rounded-xl border border-border">
          <h4 className="font-semibold mb-3 text-foreground">Selected Products:</h4>
          <ul className="space-y-2">
            {selectedProducts.map((product) => (
              <li key={product.id} className="flex items-center text-sm text-foreground/90">
                <CheckCircle className="w-4 h-4 text-brand-accent mr-2" />
                <span>{product.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className={`w-full px-4 py-3 h-auto rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="astermedicines@example.com"
                className={`w-full px-4 py-3 h-auto rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                <Phone className="w-4 h-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 **********"
                className={`w-full px-4 py-3 h-auto rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground ${errors.phone ? "border-destructive" : ""}`}
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="company" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                <Building className="w-4 h-4" />
                Company Name (Optional)
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company name"
                className={`w-full px-4 py-3 h-auto rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground ${errors.company ? "border-destructive" : ""}`}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              Message / Requirements *
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please provide details about your inquiry, required quantities, delivery location, etc."
              rows={5}
              className={`w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground resize-none ${errors.message ? "border-destructive" : ""}`}
            />
            {errors.message && (
              <p className="text-sm text-destructive mt-1">{errors.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-6 h-auto border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 px-6 py-6 h-auto bg-brand-accent hover:bg-brand-accent/90 text-white font-medium rounded-lg shadow-lg hover:shadow-brand-accent/25 transition-all duration-300 group"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Submit Inquiry
                  <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkInquiryForm;

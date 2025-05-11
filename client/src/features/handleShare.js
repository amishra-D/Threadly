import { toast } from "sonner";

export const handleShare = async (postId, caption = "") => {
  const shareUrl = `${window.location.origin}/post/${postId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: caption || "Check out this post!",
        text: caption || "",
        url: shareUrl,
      });
      toast.success("Post shared successfully!");
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Share cancelled by user");
      } else {
        console.error("Sharing failed:", err);
        toast.error("Sharing failed");
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  }
};

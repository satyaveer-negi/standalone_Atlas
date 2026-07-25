export interface Comment {
  commentId: string;
  author: string;
  text: string;
  timestamp: string;
  replies: Comment[];
}

export interface DiscussionThread {
  packageId: string;
  comments: Comment[];
}

// 💬 PROGRAM III.5: COLLABORATION HUB (THREADED DISCUSSIONS)
export class CollaborationHub {
  private threads = new Map<string, DiscussionThread>();

  public getThread(packageId: string): DiscussionThread {
    if (!this.threads.has(packageId)) {
      this.threads.set(packageId, { packageId, comments: [] });
    }
    return this.threads.get(packageId)!;
  }

  public addComment(packageId: string, author: string, text: string): void {
    const thread = this.getThread(packageId);
    const comment: Comment = {
      commentId: `cmt-${Date.now()}`,
      author,
      text,
      timestamp: new Date().toLocaleTimeString(),
      replies: []
    };
    thread.comments.push(comment);
    console.log(`[Collaboration] Comment added by "${author}" on package "${packageId}"`);
  }

  public addReply(packageId: string, parentCommentId: string, author: string, text: string): void {
    const thread = this.getThread(packageId);
    const reply: Comment = {
      commentId: `rep-${Date.now()}`,
      author,
      text,
      timestamp: new Date().toLocaleTimeString(),
      replies: []
    };

    const findAndAdd = (comments: Comment[]): boolean => {
      for (const c of comments) {
        if (c.commentId === parentCommentId) {
          c.replies.push(reply);
          return true;
        }
        if (c.replies.length > 0 && findAndAdd(c.replies)) {
          return true;
        }
      }
      return false;
    };

    findAndAdd(thread.comments);
    console.log(`[Collaboration] Reply added by "${author}" on comment "${parentCommentId}"`);
  }
}

export const activeCollaborationHub = new CollaborationHub();

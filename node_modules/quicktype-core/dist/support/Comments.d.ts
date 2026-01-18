import type { Sourcelike } from "../Source";
export interface CommentOptions {
    afterComment?: string;
    beforeComment?: string;
    firstLineStart?: string;
    lineEnd?: string;
    lineStart?: string;
}
interface DescriptionBlockCommentConfig {
    descriptionBlock: Sourcelike[];
}
interface InlineCommentConfig {
    lines: Sourcelike[];
}
type CustomCommentConfig = CommentOptions & {
    customLines: Sourcelike[];
};
export type CommentConfig = DescriptionBlockCommentConfig | InlineCommentConfig | CustomCommentConfig;
export type Comment = string | CommentConfig;
export declare const isStringComment: (comment: Comment) => comment is string;
export {};

import { z } from "zod";
import { CATEGORIES } from "../constants/post.ts";

export const MAX_TITLE_LENGTH = 80;
export const MAX_BODY_LENGTH = 2000;
export const MAX_TAGS_COUNT = 5;
export const MAX_TAG_LENGTH = 24;
export const BEN_WORDS = ["캄보디아", "프놈펜", "불법체류", "텔레그램"];

const checkBannedWords = (value: string, ctx: z.RefinementCtx) => {
  const foundWords = BEN_WORDS.filter((word) => value.includes(word));
  if (foundWords.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `금칙어가 포함되어 있습니다: ${foundWords.join(", ")}`,
    });
  }
};

const parseTagArray = (value: string) => {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
};

const validateTagCount = (arr: string[]) => {
  return arr.length <= MAX_TAGS_COUNT;
};

const validateTagLength = (arr: string[]) => {
  return arr.every((tag) => tag.length <= MAX_TAG_LENGTH);
};

const validateTagDuplication = (arr: string[]) => {
  return arr.length === new Set(arr).size;
};

const baseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해주세요")
    .max(MAX_TITLE_LENGTH, `제목은 최대 ${MAX_TITLE_LENGTH}자까지 입력 가능합니다`)
    .superRefine(checkBannedWords),
  body: z
    .string()
    .trim()
    .min(1, "본문을 입력해주세요")
    .max(MAX_BODY_LENGTH, `본문은 최대 ${MAX_BODY_LENGTH}자까지 입력 가능합니다`)
    .superRefine(checkBannedWords),
  tags: z
    .string()
    .superRefine(checkBannedWords)
    .transform(parseTagArray)
    .refine(validateTagCount, { message: `태그는 최대 ${MAX_TAGS_COUNT}개까지 입력 가능합니다` })
    .refine(validateTagLength, { message: `각 태그는 최대 ${MAX_TAG_LENGTH}자까지 입력 가능합니다` })
    .refine(validateTagDuplication, { message: "각 태그는 중복이 불가능합니다." }),
  category: z.enum(CATEGORIES, { message: "카테고리를 선택해주세요" }),
});

export const postSchema = baseSchema;

export type PostFormDataInput = z.input<typeof postSchema>;
export type PostFormDataOutput = z.output<typeof postSchema>;

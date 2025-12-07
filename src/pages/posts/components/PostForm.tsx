import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  postSchema,
  type PostFormDataInput,
  type PostFormDataOutput,
  MAX_TITLE_LENGTH,
  MAX_BODY_LENGTH,
  MAX_TAGS_COUNT,
  MAX_TAG_LENGTH,
} from "../../../schemas/postSchema";
import { CATEGORIES } from "../../../constants/post";

interface PostFormProps {
  defaultValues?: Partial<PostFormDataInput>;
  onSubmit: (data: PostFormDataOutput) => Promise<void>;
  submitButtonText: string;
  isLoading: boolean;
}

function PostForm({ defaultValues, onSubmit, submitButtonText, isLoading }: PostFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PostFormDataInput, unknown, PostFormDataOutput>({
    resolver: zodResolver(postSchema),
    mode: "all",
    defaultValues: defaultValues || {
      title: "",
      body: "",
      tags: "",
      category: undefined,
    },
  });

  const title = watch("title");
  const body = watch("body");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <input {...register("title")} placeholder="제목" className="w-full bg-blue-200 p-1" />
        <div className="flex items-center justify-between gap-2">
          {errors.title ? <p className="text-xs text-red-500">{errors.title.message}</p> : <div />}
          <p className="text-xs text-gray-500">
            {title?.length || 0}/{MAX_TITLE_LENGTH}
          </p>
        </div>
      </div>
      <div>
        <textarea {...register("body")} className="h-[500px] w-full resize-none bg-blue-200 p-1" />
        <div className="flex items-center justify-between gap-2">
          {errors.body ? <p className="text-xs text-red-500">{errors.body.message}</p> : <div />}
          <p className="text-xs text-gray-500">
            {body?.length || 0}/{MAX_BODY_LENGTH}
          </p>
        </div>
      </div>
      <div>
        <input
          {...register("tags")}
          placeholder={`태그 (쉼표로 구분, 최대 ${MAX_TAGS_COUNT}개, 각 ${MAX_TAG_LENGTH}자)`}
          className="w-full bg-blue-200 p-1"
        />
        {errors.tags && <p className="text-xs text-red-500">{errors.tags.message}</p>}
      </div>
      <div>
        <select {...register("category")} className="bg-blue-200 p-1">
          <option value="">카테고리 선택</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
      </div>
      <button
        disabled={!isValid || isLoading}
        type="submit"
        className="bg-blue-600 p-2 text-white disabled:bg-gray-400"
      >
        {submitButtonText}
      </button>
    </form>
  );
}

export default PostForm;

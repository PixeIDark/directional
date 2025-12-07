import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  postSchema,
  type PostFormDataInput,
  type PostFormDataOutput,
  MAX_TITLE_LENGTH,
  MAX_BODY_LENGTH,
  MAX_TAGS_COUNT,
} from "../../../schemas/postSchema";
import { CATEGORIES } from "../../../constants/post";

interface PostFormProps {
  defaultValues?: Partial<PostFormDataInput>;
  onSubmit: (data: PostFormDataOutput) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
  isLoading: boolean;
}

function PostForm({ defaultValues, onSubmit, onCancel, submitButtonText, isLoading }: PostFormProps) {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register("title")}
          placeholder="제목을 입력하세요"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
        <div className="flex items-center justify-between">
          {errors.title ? <p className="text-sm text-red-500">{errors.title.message}</p> : <div />}
          <p className="text-sm text-gray-400">
            {title?.length || 0}/{MAX_TITLE_LENGTH}
          </p>
        </div>
      </div>
      <div>
        <textarea
          {...register("body")}
          placeholder="내용을 입력하세요"
          className="h-[400px] w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
        <div className="flex items-center justify-between">
          {errors.body ? <p className="text-sm text-red-500">{errors.body.message}</p> : <div />}
          <p className="text-sm text-gray-400">
            {body?.length || 0}/{MAX_BODY_LENGTH}
          </p>
        </div>
      </div>
      <div>
        <input
          {...register("tags")}
          placeholder={`태그를 입력하세요 (쉼표로 구분, 최대 ${MAX_TAGS_COUNT}개)`}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
        {errors.tags ? <p className="text-sm text-red-500">{errors.tags.message}</p> : <div className="h-5" />}
      </div>
      <div>
        <select
          {...register("category")}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="">카테고리를 선택하세요</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category ? <p className="text-sm text-red-500">{errors.category.message}</p> : <div className="h-5" />}
      </div>
      <div className="flex flex-row-reverse gap-3">
        <button
          disabled={!isValid || isLoading}
          type="submit"
          className="rounded bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isLoading ? "처리 중..." : submitButtonText}
        </button>
        <button onClick={onCancel} type="button" className="rounded bg-gray-400 px-6 py-2 font-medium text-white">
          취소
        </button>
      </div>
    </form>
  );
}

export default PostForm;

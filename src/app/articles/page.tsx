import ArticleUpload from "@/components/articles/ArticleUpload";
import ArticleList from "@/components/articles/ArticleList";

export default function ArticlesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <ArticleUpload />

      <ArticleList />
    </div>
  );
}
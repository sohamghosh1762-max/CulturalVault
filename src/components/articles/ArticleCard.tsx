"use client";

export default function ArticleCard({
  article,
  onDelete,
  onEdit,
}: {
  article: any;
  onDelete: (id: number) => void;
  onEdit: (article: any) => void;
}) {
  return (
    <div className="border rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-lg transition-all">
      
      {/* Cover Image */}
      {article.image ? (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-52 object-cover"
        />
      ) : (
        <div className="h-52 flex items-center justify-center bg-muted text-muted-foreground">
          No Cover Image
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold">
            {article.title}
          </h3>

          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
            {article.category}
          </span>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          📍 {article.region}
        </p>

        <div className="flex gap-2 mt-3">
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              article.threat === "Endangered"
                ? "bg-red-100 text-red-700"
                : article.threat === "Vulnerable"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {article.threat}
          </span>

          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
            ⭐ {article.score}/100
          </span>
        </div>

        <p className="mt-4 text-muted-foreground line-clamp-3">
          {article.shortDescription}
        </p>

        {/* Read More Section */}
        <details className="mt-4">
          <summary className="cursor-pointer text-primary font-medium">
            Read More
          </summary>

          <div className="mt-3 text-sm leading-relaxed">
            {article.content}
          </div>
        </details>

        {/* Buttons */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={() => onEdit(article)}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(article.id)}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
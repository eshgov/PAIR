import ArticleCard from "@/components/ArticleCard";
import { getArticles, mapArticle } from "@/lib/api";

export default async function Home() {
  let rawArticles = [];
  try {
    rawArticles = await getArticles();
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  // Ensure it's an array
  if (!Array.isArray(rawArticles)) {
    rawArticles = [];
  }

  const articles = rawArticles.map(mapArticle);

  // Filter opinion articles
  const opinionPieces = articles.filter(a => a.category.toLowerCase() === 'opinion').slice(0, 2);
  const opinionIds = opinionPieces.map(a => a.id);

  // Find a featured article (e.g. spotlight, or just the latest if none exists)
  let featuredArticle = articles.find(a => a.category.toLowerCase() === 'spotlight' && !opinionIds.includes(a.id));
  if (!featuredArticle && articles.length > 0) {
    featuredArticle = articles.find(a => !opinionIds.includes(a.id));
  }

  const featuredId = featuredArticle ? featuredArticle.id : null;

  // The rest for secondary articles
  const secondaryArticles = articles.filter(a => a.id !== featuredId && !opinionIds.includes(a.id)).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Featured Article */}
          <div className="lg:col-span-2">
            {featuredArticle ? (
              <ArticleCard
                {...featuredArticle}
                className="h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-md p-8 text-gray-500">
                No featured articles found.
              </div>
            )}
          </div>

          {/* Opinion Sidebar */}
          <div className="flex flex-col space-y-8">
            <h2
              className="text-2xl font-bold border-b-2 pb-2"
              style={{ borderColor: '#721ef0' }}
            >
              Opinion
            </h2>
            {opinionPieces.length > 0 ? opinionPieces.map((article) => (
              <ArticleCard key={article.id} {...article} />
            )) : (
              <p className="text-gray-500 text-sm">No opinion pieces found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Secondary Grid */}
      <section>
        <h2
          className="text-2xl font-bold border-b-2 pb-2 mb-6"
          style={{ borderColor: '#721ef0' }}
        >
          Latest Stories
        </h2>
        {secondaryArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No latest stories found.</p>
        )}
      </section>
    </div>
  );
}


import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const featuredArticle = {
    title: "The Future of Generative AI in Creative Industries",
    excerpt: "How large language models and diffusion models are reshaping the landscape of art, literature, and design.",
    category: "Spotlights",
    author: "Alice Chang",
  };

  const secondaryArticles = [
    {
      title: "Understanding Transformer Architectures",
      excerpt: "A deep dive into the mechanism that powers modern NLP.",
      category: "Technical",
      author: "Bob Smith",
    },
    {
      title: "Why AI Won't Replace Comedians Just Yet",
      excerpt: "An analysis of humor generation fails and successes.",
      category: "Humor",
      author: "Charlie Davis",
    },
    {
      title: "Ethical Considerations of Autonomous Agents",
      excerpt: "Navigating the moral landscape of AI decision making.",
      category: "Opinion",
      author: "Dana Lee",
    },
    {
      title: "New Lab Opening at CS Building",
      excerpt: "Princeton unveils state-of-the-art robotics facility.",
      category: "News",
      author: "Evan Wright",
    },
  ];

  const opinionPieces = [
    {
      title: "We Need More Transparency in AI Training Data",
      excerpt: "Open models are not enough if data remains closed.",
      category: "Opinion",
      author: "Fiona White",
    },
    {
      title: "The Case for AI Literacy in High Schools",
      excerpt: "Preparing the next generation for an AI-native world.",
      category: "Opinion",
      author: "George Green",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Featured Article */}
          <div className="lg:col-span-2">
            <ArticleCard
              {...featuredArticle}
              className="h-full"
            />
          </div>

          {/* Opinion Sidebar */}
          <div className="flex flex-col space-y-8">
            <h2
              className="text-2xl font-bold border-b-2 pb-2"
              style={{ borderColor: '#721ef0' }}
            >
              Opinion
            </h2>
            {opinionPieces.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {secondaryArticles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
      </section>
    </div>
  );
}

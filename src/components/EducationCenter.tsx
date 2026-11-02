import React, { useState } from 'react';
import { Article, ArticleCategory } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  BookOpen,
  Search,
  Clock,
  User,
  PlusCircle,
  Tag,
  ArrowRight,
  X,
  CheckCircle,
} from 'lucide-react';

interface EducationCenterProps {
  articles: Article[];
  onArticleCreated: (newArticle: Article) => void;
}

const CATEGORIES: Array<'All' | ArticleCategory> = [
  'All',
  'Crop Production',
  'Livestock Management',
  'Soil & Water',
  'Pest & Disease',
  'Climate-Smart',
  'Agri-Tech & Business',
];

export const EducationCenter: React.FC<EducationCenterProps> = ({
  articles,
  onArticleCreated,
}) => {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'All' | ArticleCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('Crop Production');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canPublish =
    currentUser?.role === 'expert' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'supplier';

  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      art.category.toLowerCase() === selectedCategory.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.excerpt.toLowerCase().includes(q) ||
      art.content.toLowerCase().includes(q) ||
      art.authorName.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        category,
        excerpt: excerpt || content.substring(0, 160) + '...',
        content,
        authorId: currentUser?.id || 'usr_expert_1',
        authorName: currentUser?.name || 'Agricultural Specialist',
        authorRole:
          currentUser?.role === 'expert'
            ? 'Senior Agronomist'
            : currentUser?.role === 'admin'
            ? 'Chief Editor'
            : 'Agrovet Input Specialist',
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to publish article');
      const saved = await res.json();
      onArticleCreated(saved);
      setShowPublishModal(false);
      setTitle('');
      setContent('');
      setExcerpt('');
      setTags('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            Verified Agronomy Library
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-emerald-950">
            Agricultural Education & Farming Guides
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Practical knowledge written by agronomists and agricultural extension officers. Modern crop management, livestock feeding formulations, and climate-smart agriculture.
          </p>
        </div>

        {canPublish && (
          <button
            onClick={() => setShowPublishModal(true)}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Farming Guide</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-stone-200 mb-8 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g. Avocado Pruning, Dairy TMR, Fall Armyworm, Drip Irrigation)..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-800 text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
          >
            {article.imageUrl && (
              <div className="aspect-16/9 bg-stone-100 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-2">
                  <span className="font-semibold text-emerald-800">{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 leading-snug group-hover:text-emerald-800 transition-colors mb-2">
                  {article.title}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                  {article.excerpt}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-medium text-stone-700">{article.authorName}</span>
                  </div>
                  <button
                    onClick={() => setReadingArticle(article)}
                    className="text-emerald-800 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setReadingArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                <span className="font-semibold text-emerald-800">{readingArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span>{readingArticle.readTime}</span>
                <span aria-hidden="true">·</span>
                <span>Published {readingArticle.publishedAt}</span>
              </div>
              <h2 className="text-2xl font-bold font-display text-emerald-950 mb-3">
                {readingArticle.title}
              </h2>
              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg text-xs text-stone-700 border border-stone-100">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold">
                  {readingArticle.authorName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-stone-900">{readingArticle.authorName}</div>
                  <div className="text-[11px] text-stone-500">{readingArticle.authorRole}</div>
                </div>
              </div>
            </div>

            <div className="prose prose-stone prose-sm max-w-none text-stone-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-3">
              {readingArticle.content}
            </div>

            {readingArticle.tags && (
              <div className="mt-8 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-stone-400 mr-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Tags:
                </span>
                {readingArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Publish Guide Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900">
                Publish Expert Agricultural Guide
              </h3>
              <button onClick={() => setShowPublishModal(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Guide Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Integrated Push-Pull Pest Management for Maize"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  placeholder="Short 2-sentence summary that appears in article card preview..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Full Guide Content & Recommendations *
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Detail step-by-step agronomic guidelines, dosage calculations, and field procedures..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maize, Pest Control, Organic Farming"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish to Hub'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};


import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  // API 1: Get all blogs
  useEffect(() => {
    fetch("http://localhost:3000/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        return response.json();
      })
      .then((data) => setPosts(data))
      .catch(() => setError("Blogs load nahi ho sake."))
      .finally(() => setLoading(false));
  }, []);

  // API 2: Get one blog by slug with auth token
  const readMore = async (slug) => {
    setDetailLoading(true);
    setError("");
    setSelectedPost(null);

    try {
      const response = await fetch(
        `http://localhost:3000/posts/${slug}`,
        {
          headers: {
            Authorization: "Bearer my-secret-token",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Blog fetch nahi hua.");
      }

      setSelectedPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // Search and filter blogs
  const filteredPosts = posts.filter((post) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      post.title.toLowerCase().includes(searchText) ||
      post.description.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app">
      <header className="header">
        <h1>BlogSpace</h1>
        <p>Explore ideas. Learn something new.</p>
      </header>

      <main className="container">
        {selectedPost ? (
          <article className="blog-detail">
            <button onClick={() => setSelectedPost(null)}>
              ← Back to blogs
            </button>

            <span className="status">
              {selectedPost.status}
            </span>

            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.description}</p>

            <div className="content">
              {selectedPost.content}
            </div>

            <small>
              Created:{" "}
              {new Date(
                selectedPost.created
              ).toLocaleDateString()}
            </small>
          </article>
        ) : (
          <>
            <h2>Latest Blogs</h2>

            {/* Search and filter controls */}
            <div className="blog-controls">
              <input
                type="text"
                placeholder="Search blogs by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="all">All Blogs</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {loading && <p>Loading blogs...</p>}

            {!loading && !error && (
              <>
                <p className="results-count">
                  Showing {filteredPosts.length} of {posts.length} blogs
                </p>

                {filteredPosts.length === 0 ? (
                  <p className="empty-message">
                    No blogs found. Try another search.
                  </p>
                ) : (
                  <div className="blog-grid">
                    {filteredPosts.map((post) => (
                      <article
                        className="blog-card"
                        key={post.id}
                      >
                        <span className="status">
                          {post.status}
                        </span>

                        <h3>{post.title}</h3>
                        <p>{post.description}</p>

                        <small>
                          {new Date(
                            post.created
                          ).toLocaleDateString()}
                        </small>

                        <button
                          className="read-button"
                          onClick={() => readMore(post.slug)}
                        >
                          Read More →
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {detailLoading && <p>Loading blog details...</p>}
        {error && <p className="error">{error}</p>}
      </main>
    </div>
  );
}

export default App;

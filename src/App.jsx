import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";

const RouterContext = createContext(null);

const routes = [
  {
    id: crypto.randomUUID(),
    name: "Home",
    url: "#/",
    element: <Home />,
  },
  {
    id: crypto.randomUUID(),
    name: "About",
    url: "#/about",
    element: <About />,
  },
  {
    id: crypto.randomUUID(),
    name: "Posts",
    url: "#/posts",
    element: <Posts />,
  },
  {
    id: crypto.randomUUID(),
    name: "Receips",
    url: "#/receips",
    element: <Receips />,
  },
  {
    id: crypto.randomUUID(),
    name: "Products",
    url: "#/products",
    element: <Products />,
  },
];

const notFound = {
  name: "Page not found",
  element: <NotFound />,
  // url: '',
};

function getRoute(routeUrl) {
  const route = routes.find((x) => x.url === routeUrl);
  return route ?? notFound;
}

function setTitle(pageTitle) {
  document.title = `${pageTitle} - ${title}`;
}

const title = "App";

function App() {
  const [route, setRoute] = useState(() => {
    if (location.hash.length < 2) {
      return routes[0];
    }

    return getRoute(location.hash);
  });

  useEffect(() => {
    setTitle(route.name);
  }, [route]);

  useEffect(() => {
    window.addEventListener("hashchange", function () {
      setRoute(getRoute(location.hash));
    });
  }, []);

  return (
    <div className="container">
      <RouterContext.Provider value={route}>
        <Header />
        <Main />
      </RouterContext.Provider>
    </div>
  );
}

function Main() {
  return (
    <div className="main">
      <Content />
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <a href="#/" className="logo">
        APP
      </a>
      <Nav />
    </div>
  );
}

function Nav() {
  const route = useContext(RouterContext);

  return (
    <ul className="nav">
      {routes.map((x) => (
        <li key={x.id}>
          <a href={x.url} className={route.url === x.url ? "selected" : ""}>
            {x.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Content() {
  const route = useContext(RouterContext);

  return (
    <div className="content">
      <h1>{route.name}</h1>
      {route.element}
    </div>
  );
}

function Home() {
  return <></>;
}

function About() {
  return (
    <>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus
        harum mollitia veniam, quidem fugiat corporis ab voluptatum odit sequi
        voluptate error repellat numquam nulla quae corrupti vero sunt delectus
        minus.
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus
        harum mollitia veniam, quidem fugiat corporis ab voluptatum odit sequi
        voluptate error repellat numquam nulla quae corrupti vero sunt delectus
        minus.
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus
        harum mollitia veniam, quidem fugiat corporis ab voluptatum odit sequi
        voluptate error repellat numquam nulla quae corrupti vero sunt delectus
        minus.
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus
        harum mollitia veniam, quidem fugiat corporis ab voluptatum odit sequi
        voluptate error repellat numquam nulla quae corrupti vero sunt delectus
        minus.
      </p>
    </>
  );
}

function Receips() {
  return <></>;
}

function Products() {
  return <></>;
}

function Posts() {
  const [postId, setPostId] = useState(null);

  return (
    <>
      {postId ? (
        <PostDetail postId={postId} setPostId={setPostId} />
      ) : (
        <PostList setPostId={setPostId} />
      )}
    </>
  );
}

function PostList({ setPostId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/posts")
      .then((r) => r.json())
      .then((r) => {
        setPosts(r.posts);
      });
  }, []);

  return (
    <>
      <div className="post-list">
        {posts.map((x) => (
          <h3 key={x.id}>
            <div className="post-item">
              <a
                href={"#/posts/" + x.id}
                onClick={(e) => {
                  e.preventDefault();
                  setPostId(x.id);
                }}
              >
                {x.title}
              </a>
            </div>
          </h3>
        ))}
      </div>
    </>
  );
}

function PostDetail({ postId, setPostId }) {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComments, setNewComments] = useState(
    localStorage.newComments ? JSON.parse(localStorage.newComments) : []
  );
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  async function getData() {
    const postData = await fetch("https://dummyjson.com/posts/" + postId).then(
      (r) => r.json()
    );
    const commentsData = await fetch(
      `https://dummyjson.com/posts/${postId}/comments`
    ).then((r) => r.json());

    setPost(postData);
    setComments(commentsData.comments);
  }
  useEffect(() => {
    localStorage.comments = JSON.stringify(comments);
  }, [comments]);

  useEffect(() => {
    if (postId !== null) {
      getData();
    }
  }, [postId]);

  function handleClick(e) {
    e.preventDefault();
    setPostId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    const newComment = {
      id: crypto.randomUUID(),
      body: formObj.message,
      postId,
      likes: 0,
      user: {
        id: crypto.randomUUID(),
        username: "laylas",
        fullName: formObj.name,
      },
    };

    setNewComments((x) => [...x, newComment]);
  }

  useEffect(() => {
    localStorage.newComments = JSON.stringify(newComments);
  }, [newComments]);

  const updatedComments = [...comments, ...newComments];
  console.log(updatedComments);


  return (
    <>
      <div className="container-card">
        <div className="card">
          <div className="face face1">
            <div className="content">
              <div className="card-header" aria-hidden="true">
                <h3 className="header-title">{post.title}</h3>
                <p>{post.body}</p>
              </div>
            </div>
          </div>
          <div className="face face2">
            <div className="content">
                 <div className="commentList">
        {comments.length !== 0 ? (
          <>
            {comments.map((x) => (
              <p key={x.id} className="commentItem">
                <strong>{x.user.fullName}</strong> : {x.body}
                <p><i class="fa fa-thumbs-up"></i>{x.likes}</p>
              </p>
            ))}
            {newComments.map((x) => (
              <p key={x.id} className="commentItem">
                <strong>{x.user.fullName}</strong> : {x.body}
                <p><i class="fa fa-thumbs-up"></i>{x.likes}</p>
              </p>
            ))}
          </>
        ) : (
          <>
            {updatedComments.map((x) => (
              <p key={x.id} className="commentItem">
                <strong>{x.user.fullName}</strong> : {x.body}
                <p><i class="fa fa-thumbs-up"></i>{x.likes}</p>
              </p>
            ))}
          </>
        )}
      </div>
            </div>
          </div>
        </div>
      </div>
      <p className="back">
        <a href="#" onClick={handleClick}>
          back
        </a>
      </p>
      <div className="form-container">
        <div className="row body">
          <form onSubmit={handleSubmit} action="#">
            <ul>
              <li>
                <p className="left">
                  <label htmlFor="name">
                    <input placeholder="enter your namee"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      name="name"
                    />
                  </label>
                </p>
              </li>
              <li>
                <label htmlFor="message">
                  <textarea placeholder="Your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    name="message"
                  ></textarea>
                </label>
              </li>

              <li>
                <input className="btn btn-submit" type="submit" value="Submit" />
                <small>
                  or press <strong>enter</strong>
                </small>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </>
  );
}

function NotFound() {
  return (
    <p>
      Page not found. <a href="#/">return home</a>
    </p>
  );
}
export default App;

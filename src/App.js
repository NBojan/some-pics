import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo';

const key = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = "https://api.unsplash.com/photos/";
const searchUrl = "https://api.unsplash.com/search/photos/";

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [err, setErr] = useState({show: false, msg: ""});
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const [newImages, setNewImages] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const fetching = () => {
    setLoading(true);

    let url;
    const pageQuery = `&page=${page}`;
    const searchQuery = `&query=${term}`;
    if(term){
      url = `${searchUrl}${key}${searchQuery}${pageQuery}`; 
    } else {
      url = `${mainUrl}${key}${pageQuery}`;
    }

    fetch(url)
    .then(response => {
      if(!response.ok) throw new Error("Something went wrong...");
      return response.json()
    })
    .then(data => {
      if(data.length > 0 || data.results.length > 0){
        setPhotos(old => {
          if(term && page === 1){
            return data.results;
          }
          else if(term){
            return [...old, ...data.results]
          }
          else if(page === 1){
            return data;
          }
          else {
            return [...old, ...data];
          }
        })
        setErr({show: false, msg: ""});
      } else {
        setErr({show: true, msg: "No results. Try something else."});
      }
      setNewImages(false);
      setLoading(false);
    })
    .catch(err => {
      setErr({show: true, msg: err.message});
      setLoading(false);
    })
  }

  const handleSubmit = e => {
    e.preventDefault();
    if(page === 1){
      fetching();
    } else {
      setPage(1);
    }
  }
  const invokeSetPage = () => {
    if((window.innerHeight + window.scrollY) >= document.body.scrollHeight -2){
      setNewImages(true);
    }
  }

  useEffect(() => {
    fetching();
     // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    if(!mounted){
      setMounted(true);
    }

    if(loading) return  
    if(!newImages) return
    else {
      setPage(old => old + 1);
    }
     // eslint-disable-next-line
  }, [newImages])

  useEffect(() => {
    window.addEventListener("scroll", invokeSetPage);
    return () => window.removeEventListener("scroll", invokeSetPage);
  }, [])

  return (
    <div className="containerBoot m-auto pTB-80">
      <section className="search mb-48">
        <form className="search-form mb-12" onSubmit={handleSubmit}>
          <input type="text" placeholder='Search' className='flex1' value={term} onChange={e => setTerm(e.target.value)}/>
          <button type='submit' className='d-flex'><FaSearch /></button>
        </form>
        {err.show && <h4 className='error-msg'>{err.msg}</h4>}
      </section>

      <section className="photos-cont d-flex flex-wrap space-between align-center">
        {photos.map((item, index) => <Photo key={index} {...item}/>)}
      </section>

      {loading && <h2 className='ta-center'>Loading...</h2>}
    </div>
  );
}

export default App;

import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import StarDisplay from "../components/StarDisplay"
import Navbar from "../layouts/Navbar.jsx"

const ProductListing = () => {

  const[utilMenu, setUtilMenu] = useState(false)

  const navigate = useNavigate()

  const { item } = useParams();
  const { path } = useParams();
  
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let response = await axios.get('http://localhost:3500/product/'+path+'/'+item)
        if(item === "all") {
          response = await axios.get('http://localhost:3500/product/')
        }
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items", error);
      }
    }
  fetchItems();
  }, [item, path]);

  const fetchItemsByQuery = async (sort, order) => {
    try {
      console.log("called");
      console.log(sort)
      console.log(order)
      const response = await axios.get('http://localhost:3500/product/'+path+'/'+item+'?sort='+sort+'&order='+order)
      setItems(response.data)
      console.log(items)
    } catch (error) {
      console.error("Error fetching items by name sort", error)
    }
  }

  const getProductImageURL = (product) => {
    return "/products/" +  product + ".jpg"
  }

  return (
    <div>
      <Navbar/>
      <div className="mx-2 md:mx-5">
      <div className="flex flex-row justify-between items-center p-2 border-b-[1px] border-solid border-borderColor h-[7vh]">
        {/* Results */}
        <p className="font-sans text-sm text-center">{items.length} Results</p>
        {/* Right Container */}
        <div className="flex flex-row items-center gap-x-2">
          {/* Sort Button */}
          <div className="flex flex-row items-center" onClick={() => setUtilMenu(true)}>
            <AiOutlineArrowDown />
            <AiOutlineArrowUp />
            <p className="font-sans text-sm text-center">Sort</p>
          </div>
        </div>
      </div>

      {/* Utility Menu */}
      {utilMenu ? (
        <div>
          {/* Overlay */}
          <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div>

          {/* Utility Menu */}
          <div className="absolute top-1/2 left-1/2 -mt-[25vh] -ml-[25%] w-1/2 h-1/2 bg-white z-10 flex flex-col justify-evenly rounded-md">
            {/* Name */}
            {/* Ascending */}
            <button className="bg-backgroundColor text-white font-sans font-bold sm:w-1/4 mx-auto p-4 rounded-md" onClick={() => {
              fetchItemsByQuery("name", "asc");
              setUtilMenu(false)
            }}>
              A to Z
            </button>
            {/* Descending */}
            <button className="bg-backgroundColor text-white font-sans font-bold sm:w-1/4 mx-auto p-4 rounded-md" onClick={() => {
              fetchItemsByQuery("name", "desc");
              setUtilMenu(false)
            }}>
              Z to A
            </button>
            

            {/* Rating */}
            {/* Best = descending */}
            <button className="bg-backgroundColor text-white font-sans font-bold sm:w-1/4 mx-auto p-4 rounded-md" onClick={() => {
              fetchItemsByQuery("rating", "desc");
              setUtilMenu(false)
            }}>
              Best Ratings
            </button>
            {/* Worst = Ascending */}
            <button className="bg-backgroundColor text-white font-sans font-bold sm:w-1/4 mx-auto p-4 rounded-md" onClick={() => {
              fetchItemsByQuery("rating", "asc");
              setUtilMenu(false)
            }}>
              Worst Ratings
            </button>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* Product Grid Container */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 h-fit gap-5 my-5">
      {items.map(item => (
          <div key={item._id} className="border border-solid border-borderColor rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.1)]" onClick={() => {
            navigate("/product/"+item._id)
          }}>
          {/* Image */}
          <div className="border-b-[1px] border-solid border-borderColor p-2">
            <img src={getProductImageURL(item._id)} alt="" className="h-[200px] w-auto mx-auto" />
          </div>
          {/* Title */}
          <p className="text-center text-sm px-2">{item.name}</p>
          {/* Average Rating + (# of ratings) */}
          <div className="flex flex-row items-center justify-center h-fit">
              <StarDisplay rating={item.rating} />
            <div>
              <p className="text-sm">({item.reviewCount})</p>
            </div>
          </div>
          </div>
      ))}        
      </div>
    </div>
    </div>
  )
}

export default ProductListing
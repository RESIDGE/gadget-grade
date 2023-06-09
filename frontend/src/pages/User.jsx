import Navbar from "../layouts/Navbar.jsx"
import { useState, useEffect  } from "react"
import { useParams } from "react-router-dom";
import axios from "axios";
import StarDisplay from "../components/StarDisplay.jsx";
import {FcCheckmark} from "react-icons/fc"

const User = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState({});
    const [reviews, setReviews] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newDescription, setNewDescription] = useState('');
    const [error, setError] = useState(null);
    const [selectedValue, setSelectedValue] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await axios.get('http://localhost:3500/user/'+id)
            setProfile(response.data);
            setNewDescription(response.data.description);
          } catch (error) {
            console.error("Error fetching profile", error)
          }
        }

        const fetchUserReviews = async () => {
            try {
              const response = await axios.get('http://localhost:3500/review/user/'+id)
              setReviews(response.data);
            } catch (error) {
              console.error("Error fetching items", error)
            }
        }
      
        fetchProfile()
        fetchUserReviews()
      }, [id]);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
        setError(null);
    }

    const handleDescriptionChange = (e) => {
        setNewDescription(e.target.value);
    }

    const handleDescriptionUpdate = async () => {
        if (!newDescription.trim()) {
            setError('Description cannot be empty');
            return;
        }
        if (newDescription.length > 500) {
            setError('Description cannot exceed 500 characters');
            return;
        }
        try {
            const response = await axios.put(`http://localhost:3500/user/${id}`, { description: newDescription });
            setProfile(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating description", error);
        }
    }

    const handleProfileImageChange = (event) => {
        // Access the selected value using event.target.value
        const value = event.target.value;
        setSelectedValue(value);
    };

    const handleProfileImageClick = async () => {
        try {
            const response = await axios.put(`http://localhost:3500/user/${id}`, { image: selectedValue })
            setReviews(response.data);
            window.location.reload()
        } catch (error) {
            console.error("Error fetching items", error)
        }
    }

    const getUserImageURL = () => {
        return "/users/" + profile.image + ".svg";
    };

    const getProductImageURL = (product) => {
        return "/products/" +  product + ".jpg"
    }

    return (
        <div>
            <Navbar/>
            <div className="flex flex-row justify-between gap-x-5 h-screen w-auto m-[5%]">
                {/* Left Container */}
                <div className ="flex flex-col w-[20%] h-full">
                    <div className="rounded-md border-[4px] p-10 border-solid border-black w-full h-auto">
                        <img src={getUserImageURL()} alt="" className="rounded-md border-[2px] p-1 border-solid border-black w-full h-auto" />
                    </div>

                    <div className="mt-[2%] flex bg-gray-200 rounded-lg shadow-md p-2">
                        <h1 className="font-bold w-1/2">Reviews: {profile.reviews}</h1>
                        <div className="flex flex-row items-center gap-x-1">
                            <h1 className="font-bold">Verified: </h1>
                            {profile.active ? <FcCheckmark /> : ("")}
                        </div>
                    </div>

                    {profile.active && sessionStorage.getItem("user") && JSON.parse(sessionStorage.getItem("user"))._id === id ? (
                        <div className="mt-[2%] flex flex-row items-center gap-x-1 bg-gray-200 rounded-lg shadow-md p-2">
                            <label htmlFor="images" className="text-center">Select Image:</label>
                            <select className="bg-gray-200" defaultValue={profile.image} onChange={handleProfileImageChange}>
                                <option value="bear">Bear</option>
                                <option value="dragon">Dragon</option>
                                <option value="phoenix">Phoenix</option>
                                <option value="shark">Shark</option>
                                <option value="tiger">Tiger</option>
                                <option value="default">Earth</option>
                            </select>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 mb-2" onClick={handleProfileImageClick}>
                                Update
                            </button>
                        </div>
                    ) : 
                        sessionStorage.getItem("user") && JSON.parse(sessionStorage.getItem("user"))._id === id ? (
                            <div className="mt-[2%] flex flex-row items-center gap-x-1 bg-gray-200 rounded-lg shadow-md p-2">
                                <p className="font-bold">Reach 10 reviews to unlock a special option</p>
                            </div>
                        ) : (
                            ""
                        )
                    }

                    <div className=" flex-col flex-1 mt-[3%] bg-gray-200 bg-opacity-50 h-auto p-2 rounded-lg shadow-md">

                        <div className="flex ">
                            <div className="w-1/2">
                                <h1 className="font-bold mt-1">First Name: </h1>
                                <p className="bg-gray-100 mt-1 p-1 rounded-lg shadow-md w-3/4">{profile.firstName}</p>
                            </div>
                        
                            <div className="flex-col w-1/2">
                                <h1 className="font-bold mt-1">Last Name: </h1>
                                <p className="bg-gray-100 mt-1 p-1 rounded-lg shadow-md w-3/4">{profile.lastName}</p>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="flex-col w-1/2">
                                <h1 className="font-bold mt-2">Location: </h1>
                                <p className="bg-gray-100 mt-1 p-1 rounded-lg shadow-md w-3/4">{profile.location}</p>
                            </div>

                            <div className="flex-col w-1/2">
                                <h1 className="font-bold mt-2">Account Created: </h1>
                                <p className="bg-gray-100 mt-1 p-1 rounded-lg shadow-md w-3/4">{new Date(profile.timeStamp).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                            </div>
                        </div>

                        <div className="flex-col mt-[2%] h-3/5">
                            <h1 className="font-bold mt-2">User Description:</h1>
                            {isEditing ? (
                                <div>
                                    <textarea
                                        className="bg-gray-100 mt-1 p-2 rounded-lg shadow-md h-full w-full break-words whitespace-pre-wrap overflow-auto"
                                        value={newDescription}
                                        onChange={handleDescriptionChange}
                                    />
                                    {error && <p className="text-red-500">{error}</p>}
                                    <button 
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
                                        onClick={handleDescriptionUpdate}
                                    >
                                        Update
                                    </button>
                                    <button 
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded m-2"
                                        onClick={handleEditClick}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="bg-gray-100 mt-1 p-2 rounded-lg shadow-md h-full w-full break-words whitespace-pre-wrap overflow-auto">{profile.description}</p>
                                    {sessionStorage.getItem("user") && JSON.parse(sessionStorage.getItem("user"))._id === id ? (
                                        <button 
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 mb-2 "
                                        onClick={handleEditClick}
                                        >
                                            Edit
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Container */}
                <div className="w-[80%] h-full bg-gray-200 p-3 rounded-lg shadow-md overflow-y-auto">
                    <h1 className="font-bold text-lg mb-2">Recent Activity:</h1>

                    <div className="flex flex-col gap-y-5">
                        {reviews.map(review => (
                            <div key={review._id} className="bg-white p-4 rounded-lg shadow-[0_0_10px_0_rgba(0,0,0,0.1)] overflow-hidden flex flex-row h-[25vh] gap-x-2">
                                <a href={`/product/${review.product}`} >
                                {/* Image */}
                                <div className="h-[20vh]">
                                    <img src={getProductImageURL(review.product)} alt="" className="h-full w-auto p-2"/>
                                </div>
                                </a>

                                {/* Title and Rating and Body Container */}
                               <div className="flex flex-col flex-1 items-center p-2">
                                    {/* Title and Rating Container */}
                                    <div className="flex flex-row items-center w-full">
                                        <h2 className="text-xl font-bold pr-2">{review.title}</h2>
                                        <div>
                                            <StarDisplay rating={review.rating}/>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <p className="mb-3 text-gray-700">{review.body}</p>
                                    </div>
                               </div>

                               {/* Stats Container */}
                                <div className="flex flex-col justify-evenly items-center p-2">
                                    <div>
                                        <span className="mr-2">Likes: {review.like}</span>
                                        <span>Dislikes: {review.dislike}</span>
                                    </div>
                                    <small className="text-gray-500">{new Date(review.timeStamp).toLocaleString()}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User
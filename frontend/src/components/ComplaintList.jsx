import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';


const ComplaintList = ({ complaints, setComplaints, setEditingComplaint }) => {
  const { user } = useAuth();
  const navigate = useNavigate();


  const handleDelete = async (complaintId) => {
    try {
      await axiosInstance.delete(`/api/complaints/${complaintId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setComplaints(complaints.filter((complaint) => complaint._id !== complaintId));
    } catch (error) {
      alert('Failed to delete complaint.');
    }
  };

  return (
    <div>
      {complaints.map((complaint) => (
        <div key={complaint._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{complaint.title}</h2>
          <p>{complaint.description}</p>
          <p className="text-sm text-gray-500">Date: {new Date(complaint.date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-700">Status: {complaint.status || 'received'}</p> 
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => setEditingComplaint(complaint)}
              className="bg-yellow-500 text-white px-4 py-2 rounded w-24 text-center"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(complaint._id)}
              className="bg-red-500 text-white px-4 py-2 rounded w-24 text-center"
            >
              Delete
            </button>
            {complaint.status === 'closed' && (
              <button
                onClick={() => navigate('/feedback')}
                className="bg-indigo-600 text-white px-4 py-2 rounded w-24 text-center"
              >
                Feedback
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;

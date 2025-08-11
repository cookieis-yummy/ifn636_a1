import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Feedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);            // closed complaints
  const [editing, setEditing] = useState({});        // { [id]: true/false }
  const [drafts, setDrafts] = useState({});          // { [id]: { text, rating } }
  const [loading, setLoading] = useState(false);

  const fetchClosed = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/feedback', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(res.data || []);
      // seed drafts with current feedback values
      const init = {};
      (res.data || []).forEach(c => {
        init[c._id] = {
          text: c.feedback?.text || '',
          rating: c.feedback?.rating || '',
        };
      });
      setDrafts(init);
    } catch (e) {
      alert('Failed to load closed complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const handleEdit = (id) => setEditing((s) => ({ ...s, [id]: true }));
  const handleCancel = (id) => setEditing((s) => ({ ...s, [id]: false }));

  const handleDraftChange = (id, field, value) => {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [field]: value } }));
  };

  const handleSave = async (id) => {
    try {
      const body = {
        text: drafts[id]?.text ?? '',
        rating: drafts[id]?.rating ? Number(drafts[id].rating) : undefined,
      };
      const res = await axiosInstance.put(`/api/feedback/${id}`, body, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // Update local items with the updated complaint
      setItems((arr) => arr.map((c) => (c._id === id ? res.data : c)));
      // Lock edits
      setEditing((s) => ({ ...s, [id]: false }));
    } catch {
      alert('Failed to save feedback.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems((arr) => arr.map((c) => (c._id === id ? res.data : c)));
      setDrafts((d) => ({ ...d, [id]: { text: '', rating: '' } }));
      setEditing((s) => ({ ...s, [id]: false }));
    } catch {
      alert('Failed to delete feedback.');
    }
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    return isNaN(d) ? '—' : d.toLocaleDateString();
  };

  if (loading) return <div className="max-w-3xl mx-auto mt-10">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Feedback</h1>
        <button onClick={() => navigate('/complaints')} className="px-4 py-2 bg-gray-700 text-white rounded">
          Back
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-4 rounded shadow">No closed complaints yet.</div>
      ) : (
        items.map((c) => {
          const isEditing = !!editing[c._id];
          const draft = drafts[c._id] || { text: '', rating: '' };
          return (
            <div key={c._id} className="bg-white p-4 rounded shadow mb-4">
              <div className="mb-2">
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-gray-500">Date: {formatDate(c.date)}</div>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Your feedback</label>
                <textarea
                  value={draft.text}
                  onChange={(e) => handleDraftChange(c._id, 'text', e.target.value)}
                  disabled={!isEditing}
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="Write your feedback here…"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select
                  value={draft.rating}
                  onChange={(e) => handleDraftChange(c._id, 'rating', e.target.value)}
                  disabled={!isEditing}
                  className="w-32 border rounded p-2"
                >
                  <option value="">Choose…</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              <div className="space-x-2">
                {!isEditing ? (
                  <button onClick={() => handleEdit(c._id)} className="px-4 py-2 bg-yellow-500 text-white rounded">
                    Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => handleSave(c._id)} className="px-4 py-2 bg-green-600 text-white rounded">
                      Save
                    </button>
                    <button onClick={() => handleCancel(c._id)} className="px-4 py-2 bg-gray-500 text-white rounded">
                      Cancel
                    </button>
                  </>
                )}
                <button onClick={() => handleDelete(c._id)} className="px-4 py-2 bg-red-600 text-white rounded">
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Feedback;

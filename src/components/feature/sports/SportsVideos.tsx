import { useState, useMemo, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, Plus, Filter } from 'lucide-react';
import { useCreateSportMutation, useGetAllSportsQuery } from '../../../redux/api/sports/sportsApis';
import { toast } from 'sonner';

/* =====================
   Types & Interfaces
===================== */

export type SportType = 'football' | 'basketball' | 'volleyball' | 'lacrosse' | string;

export interface SportsVideo {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  type: SportType;
  src: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SportsApiResponse {
  success: boolean;
  data: SportsVideo[];
}

/* =====================
   Component
===================== */

export default function SportsVideos() {
  const { data } = useGetAllSportsQuery({}) as { data?: SportsApiResponse };
  const [createSport] = useCreateSportMutation();

  const videos: SportsVideo[] = data?.data ?? [];

  const [selectedType, setSelectedType] = useState<SportType | 'all'>('all');
  const [editingVideo, setEditingVideo] = useState<SportsVideo | null>(null);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);


  const [newSport, setNewSport] = useState<Omit<SportsVideo, '_id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    thumbnail: '',
    type: '',
    src: '',
    order: 0,
  });
  const types: (SportType | 'all')[] = useMemo(() => {
    const unique = new Set<SportType>(videos.map(v => v.type));
    return ['all', ...Array.from(unique)];
  }, [videos]);

  const filteredVideos: SportsVideo[] = useMemo(() => {
    if (selectedType === 'all') return videos;
    return videos.filter(v => v.type === selectedType);
  }, [videos, selectedType]);


  const handleAddSports = async () => {

    try {
      const result = await createSport(newSport).unwrap();
      if (result.success) {
        toast.success("Sport added successfully!")
        setNewSport({
          title: '',
          description: '',
          thumbnail: '',
          type: 'basketball',
          src: '',
          order: 0,
        })
      }
    } catch (error) {

    }


  };



  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedType(e.target.value);
  };

  const handleEdit = (video: SportsVideo): void => {
    setEditingVideo(video);
  };

  const handleDelete = (id: string): void => {
    // connect delete mutation here
    console.log('Delete video id:', id);
  };



  return (
    <div className="max-w-[1200px] mx-auto mt-[73px] p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter size={18} />
          <select
            className="border rounded-lg px-3 py-2"
            value={selectedType}
            onChange={handleFilterChange}
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Add Sport Video
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[120px_1fr_150px_80px_120px] gap-4 px-4 py-2 text-sm font-semibold text-gray-600 border-b">
        <div>Thumbnail</div>
        <div>Details</div>
        <div>Category</div>
        <div>Order</div>
        <div>Actions</div>
      </div>

      {/* Rows */}
      <div className="space-y-2 mt-2">
        {filteredVideos.map((video: SportsVideo) => (
          <div
            key={video._id}
            className="grid grid-cols-[120px_1fr_150px_80px_120px] gap-4 items-center bg-white p-4 rounded-xl shadow-sm"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-[120px] h-[70px] object-cover rounded-lg"
            />

            <div>
              <h3 className="font-semibold text-gray-800">{video.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
            </div>

            <div className="capitalize text-sm">{video.type}</div>
            <div className="text-sm">{video.order}</div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(video)}
                className="text-blue-600"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(video._id)}
                className="text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Drawer */}
      <AnimatePresence>
        {editingVideo && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl p-6  z-50"
          >
            <h2 className="text-xl font-semibold mb-4 mt-20">Edit Video</h2>

            <input
              className="w-full border p-2 rounded mb-3"
              defaultValue={editingVideo.title}
            />

            <textarea
              className="w-full border p-2 rounded mb-3"
              defaultValue={editingVideo.description}
            />

            <input
              className="w-full border p-2 rounded mb-3"
              defaultValue={editingVideo.type}
            />

            <input
              className="w-full border p-2 rounded mb-3"
              type="number"
              defaultValue={editingVideo.order}
            />

            <div className="flex gap-3">
              <button className="bg-black text-white px-4 py-2 rounded">Save</button>
              <button
                onClick={() => setEditingVideo(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Drawer */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl p-6 z-50"
          >
            <h2 className="text-xl font-semibold mb-4">Add Sport Video</h2>


            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Title"
              value={newSport.title}
              onChange={(e) => setNewSport({ ...newSport, title: e.target.value })}
            />


            <textarea
              className="w-full border p-2 rounded mb-3"
              placeholder="Description"
              value={newSport.description}
              onChange={(e) => setNewSport({ ...newSport, description: e.target.value })}
            />


            <select
              className="w-full border p-2 rounded mb-3"
              value={newSport.type}
              onChange={(e) => setNewSport({ ...newSport, type: e.target.value })}
            >
              <option value="basketball">Basketball</option>
              <option value="soccer">Soccer</option>
              <option value="volleyball">Volleyball</option>
              <option value="lacrosse">Lacrosse</option>
              <option value="football">Football</option>
              <option value="highlight">Highlight</option>
              <option value="recruiting">Recruiting</option>
            </select>


            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Thumbnail URL"
              value={newSport.thumbnail}
              onChange={(e) => setNewSport({ ...newSport, thumbnail: e.target.value })}
            />


            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Video URL"
              value={newSport.src}
              onChange={(e) => setNewSport({ ...newSport, src: e.target.value })}
            />


            <input
              className="w-full border p-2 rounded mb-3"
              type="number"
              placeholder="Order"
              value={newSport.order}
              onChange={(e) => setNewSport({ ...newSport, order: Number(e.target.value) })}
            />


            <div className="flex gap-3">
              <button
                onClick={handleAddSports}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddOpen(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

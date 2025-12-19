/**
 * @param {object} s
 * @returns {object|null}
 */
export const normalizeService = (s) => {
  if (!s) return null;
  return {
    _id: s._id || s.id || null,
    service_name: s.service_name || s.name || s.title || "Untitled Service",
    description: s.description || s.desc || s.summary || "",
    cost: Number(s.cost ?? s.price ?? 0),
    category: s.category || s.type || "",
    unit: s.unit || "",
    photo: (s.images && s.images[0]) || s.photo || "",
    images: s.images || (s.photo ? [s.photo] : []),
  };
};

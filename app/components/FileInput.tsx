const FileField = ({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => onChange(e.target.files?.[0] || null)}
      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none"
    />
    {file && (
      <img
        src={URL.createObjectURL(file)}
        alt="preview"

        className="mt-2 w-32 h-35 object-cover rounded"
      />
    )}
  </div>
);
export default FileField;
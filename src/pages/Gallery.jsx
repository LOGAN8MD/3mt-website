export default function Gallery() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-yellow-400 mb-4">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <img src="https://lh3.googleusercontent.com/p/AF1QipO_AkjK0breFs_ySD9gtCrNsGgnnf9vWnGROHfS=s1360-w1360-h1020-rw" alt="Machine 1" className="rounded shadow" />
        <img src="https://lh3.googleusercontent.com/p/AF1QipMAIm47PlmmNpViTmvDflqtFi2NIvC-K38HQgm6=s1360-w1360-h1020-rw" alt="Machine 2" className="rounded shadow" />
        <img src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4no4_lFe6fClGwHTiKCs0iac3AYTixRJqVH3iyiFocG26pEGHToTN05BJHeZkoK_UTaIdgH_SxhCulw-_Yy4PUNGClWupT7uc3UK5hf4Sm0r5nOngbxSW68ymosc70ZZ1Z5-EXk=s1360-w1360-h1020-rw" alt="Machine 3" className="rounded shadow" />
      </div>
    </div>
  );
}
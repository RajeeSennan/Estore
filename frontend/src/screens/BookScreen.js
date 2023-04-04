import { useParams } from 'react-router-dom';

function BookScreeen() {
  const params = useParams();
  const { id } = params;
  return (
    <div>
      <h1>{id}</h1>
    </div>
  );
}
export default BookScreeen;

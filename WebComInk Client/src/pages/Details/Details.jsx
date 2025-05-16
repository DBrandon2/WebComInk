import { useNavigate, useParams } from "react-router-dom";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(id);

  return <div>Détails</div>;
}

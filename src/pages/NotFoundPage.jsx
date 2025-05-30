import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">404 - Página no encontrada</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            La página que estás buscando no existe o ha sido movida.
          </p>
        </div>
        <div>
          <Link to="/" className="btn btn-primary">
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
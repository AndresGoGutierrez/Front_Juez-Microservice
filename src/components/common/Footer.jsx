function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} CodeDev. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Examify</h3>
            <p className="text-neutral-600">
              Empowering education through digital assessment solutions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-600 hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 hover:text-primary">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 hover:text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-neutral-600">Email: support@examify.com</li>
              <li className="text-neutral-600">Phone: (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-200 text-center text-neutral-600">
          <p>&copy; {new Date().getFullYear()} Examify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
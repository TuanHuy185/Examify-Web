const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-neutral-800">Examify</h3>
            <p className="text-neutral-600">
              Empowering education through digital assessment solutions.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-neutral-800">Quick Links</h3>
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
            <h3 className="mb-4 text-lg font-semibold text-neutral-800">Contact</h3>
            <ul className="space-y-2">
              <li className="text-neutral-600">Email: support@examify.com</li>
              <li className="text-neutral-600">Phone: (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-8 text-center text-neutral-600">
          <p>&copy; {new Date().getFullYear()} Examify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

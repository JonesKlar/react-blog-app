function Footer() {
    return (
      <footer className="footer footer-center p-4 bg-base-200 text-base-content mt-8">
        <aside>
          <p>© {new Date().getFullYear()} Technologie Blog</p>
        </aside>
      </footer>
    );
  }

  export default Footer;
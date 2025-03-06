# Digital CV Website

A clean, responsive website template for showcasing your professional CV/resume online.

## Features

- Modern, responsive design that works on all devices
- Sections for work experience, education, skills, languages, and projects
- Interactive skill bars with animations
- Mobile-friendly navigation
- Clean and professional layout
- Easy to customize

## How to Use

1. **Customize Content**:

   - Open `index.html` and replace the placeholder content with your personal information
   - Update your name, professional title, contact information, and social media links
   - Fill in your work experience, education, skills, languages, and projects

2. **Customize Colors**:

   - Open `styles.css` and modify the color variables at the top of the file:
     ```css
     :root {
       --primary-color: #2c3e50;
       --secondary-color: #3498db;
       --accent-color: #e74c3c;
       /* other variables */
     }
     ```

3. **Add Your Photo** (Optional):

   - Place your profile photo in the same directory
   - In `index.html`, add an image tag in the header section:
     ```html
     <div class="header-content">
       <img src="your-photo.jpg" alt="Your Name" class="profile-photo" />
       <!-- rest of the header content -->
     </div>
     ```
   - In `styles.css`, add styling for the profile photo:
     ```css
     .profile-photo {
       width: 150px;
       height: 150px;
       border-radius: 50%;
       object-fit: cover;
       border: 3px solid white;
       margin-bottom: 20px;
     }
     ```

4. **Deploy Your Website**:
   - Upload all files to your web hosting service
   - Alternatively, you can use GitHub Pages, Netlify, or Vercel for free hosting

## File Structure

- `index.html` - Main HTML file with the structure of your CV
- `styles.css` - CSS file containing all the styling
- `script.js` - JavaScript file for interactive features
- `README.md` - This documentation file

## Customization Tips

### Adding More Sections

To add a new section to your CV:

1. Add a new section to the HTML:

   ```html
   <section id="new-section">
     <h2>New Section Title</h2>
     <!-- Your content here -->
   </section>
   ```

2. Add a link to the navigation:
   ```html
   <nav>
     <ul>
       <!-- existing links -->
       <li><a href="#new-section">New Section</a></li>
     </ul>
   </nav>
   ```

### Adding Custom Fonts

To use a different font:

1. Add the font link to the `<head>` section of `index.html`:

   ```html
   <link
     href="https://fonts.googleapis.com/css2?family=YourChosenFont:wght@300;400;500;700&display=swap"
     rel="stylesheet"
   />
   ```

2. Update the font-family in `styles.css`:
   ```css
   body {
     font-family: "YourChosenFont", sans-serif;
     /* other styles */
   }
   ```

## Browser Compatibility

This template works with all modern browsers including:

- Chrome
- Firefox
- Safari
- Edge

## License

This template is free to use for personal and commercial projects.

## Credits

- Font Awesome for icons
- Google Fonts for typography

function Footer() {
   const footerStyle = {
      color: 'green',
      fontStyle: 'italic',
      fontSize: 16,
      marginTop: '20px',
   };

   return (
      <div style={footerStyle}>
         <em>Note app, Department of Computer Science, University of Helsinki 2023</em>
      </div>
   );
}

export default Footer;

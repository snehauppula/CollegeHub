// List of organizer emails - these users will have organizer privileges
// Can be configured via environment variable ORGANIZER_EMAILS (comma-separated)
const getOrganizerEmails = () => {
  if (process.env.ORGANIZER_EMAILS) {
    return process.env.ORGANIZER_EMAILS.split(',').map(email => email.trim());
  }
  
  // Default organizer emails for development
  return [
    'test@gmail.com',
    'organizer@college.edu',
    'admin@college.edu',
    'club.president@college.edu'
  ];
};

module.exports = {
  ORGANIZER_EMAILS: getOrganizerEmails()
};

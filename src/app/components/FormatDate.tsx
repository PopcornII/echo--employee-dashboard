export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      // weekday: 'long', // 'long' for full weekday name
      year: 'numeric',
      month: 'short',  // 'short' for abbreviated month
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      // second: 'numeric',
    })

};
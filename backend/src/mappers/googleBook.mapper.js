export const mapGoogleBookToSnapshot = (item) => {
    const info = item.volumeInfo || {};

    return {
        title: info.title || 'No Title',
        subtitle: info.subtitle || '',
        authors: info.authors || ['Unknown Author'],
        bookId: item.id || 'No ID',
        publishedDate: info.publishedDate || 'Unknown',
        description: info.description || 'No description available.',
        categories: info.categories || ['Uncategorized'],
        averageRating: info.averageRating || null,
        imageLinks: info.imageLinks || {},
        language: info.language || 'en',
        previewLink: info.previewLink || info.canonicalVolumeLink || null,
    }
}
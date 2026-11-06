const stock = (photo, width = 1200) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=85`

export const imageConfig = {
  profilePortrait: '/images/karan-profile.png',
  heroWorkspace: stock('photo-1531482615713-2afd69097998', 1200),
  aboutWorkspace: stock('photo-1524758631624-e2822e304c36', 1000),
  categories: {
    branding: stock('photo-1497366754035-f200968a6e72', 900),
    posters: stock('photo-1531058020387-3be344556be6', 900),
    social: stock('photo-1493225457124-a3eb161ffa5f', 900),
    thumbnails: stock('photo-1516280440614-37939bbacd81', 900),
  },
  video: {
    brandMotion: stock('photo-1506157786151-b8491531f063', 1000),
    behindScenes: stock('photo-1492684223066-81342ee5ff30', 1000),
    editSession: stock('photo-1492619375914-88005aa9e8fb', 1000),
  },
  demoVideoUrl: 'https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?autoplay=1',
}

export const resolveImage = (image, fallback = imageConfig.categories.branding) => {
  if (typeof image === 'string') return image.startsWith('http') ? image : stock(image)
  return image?.url || fallback
}

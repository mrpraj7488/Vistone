# Image Upload Service - Supabase Storage

Backend configuration for image uploads to Supabase Storage with context-aware folder organization.

## 📁 Files

| File | Purpose |
|------|---------|
| `src/utils/imageUpload.js` | Core utility with upload functions and configurations |
| `src/components/common/ImageUploader.jsx` | Reusable React component |

## 📂 Upload Contexts

| Context | Folder | Max Size | Recommended | Use For |
|---------|--------|----------|-------------|---------|
| `productFeatured` | `/products/featured` | 5MB | 1200×800px | Product main images |
| `productGallery` | `/products/gallery` | 5MB | 1200×800px | Product gallery images |
| `blogs` | `/blogs` | 5MB | 1200×630px | Blog featured images |
| `blogContent` | `/blogs/content` | 3MB | 800×600px | Blog inline images |
| `categories` | `/categories` | 2MB | 400×400px | Category icons |
| `avatars` | `/avatars` | 2MB | 256×256px | User profile pictures |
| `testimonials` | `/testimonials` | 2MB | 256×256px | Testimonial photos |
| `team` | `/team` | 3MB | 400×400px | Team member photos |
| `branding` | `/branding` | 2MB | 512×512px | Logos, favicon |
| `banners` | `/banners` | 10MB | 1920×1080px | Hero banners |
| `uploads` | `/uploads` | 50MB | 1200×800px | General uploads |

## 🔧 Supabase Setup

### 1. Create Storage Bucket

In Supabase Dashboard → Storage → New bucket:
- **Name**: `Vistone-images`
- **Public bucket**: ✅ Enabled

### 2. Bucket Policies

```sql
-- Allow public reads
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'Vistone-images');

-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'Vistone-images');
```

### 3. Environment Variables

```env
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

## 📖 Usage

### Utility Functions

```javascript
import { 
  uploadProductImage,
  uploadProductGalleryImages,
  uploadBlogImage,
  uploadCategoryImage,
  uploadAvatar,
  uploadImage
} from './utils/imageUpload';

// Product images
const result = await uploadProductImage(file, productId);
const galleryResult = await uploadProductGalleryImages(files, productId);

// Blog images
const blogResult = await uploadBlogImage(file, postSlug);

// Category/Avatar
const catResult = await uploadCategoryImage(file, categorySlug);
const avatarResult = await uploadAvatar(file, userId);

// Generic upload with context
const result = await uploadImage(file, { context: 'productFeatured' });
```

### React Component

```jsx
import ImageUploader from './components/common/ImageUploader';

<ImageUploader
  context="productFeatured"
  label="Featured Image"
  onUploadComplete={(data) => setFeaturedImage(data.publicUrl)}
  onError={(err) => console.error(err)}
/>
```

## 📤 Response Format

```javascript
{
  success: true,
  data: {
    publicUrl: "https://xxx.supabase.co/storage/v1/object/public/Vistone-images/products/featured/product_xxx.jpg",
    path: "products/featured/product_xxx.jpg",
    filename: "product_xxx.jpg",
    size: 245760,
    type: "image/jpeg",
    context: "productFeatured"
  }
}
```

## ❌ Error Codes

| Code | Description |
|------|-------------|
| `NO_FILE` | No file selected |
| `INVALID_TYPE` | File type not allowed |
| `FILE_TOO_LARGE` | Exceeds size limit |
| `UPLOAD_FAILED` | Supabase error |

'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../../api/lib/supabaseBrowser'

// --- UI Styles ---
const inputClasses = "w-full px-4 py-3 border rounded-xl shadow-inner bg-[#2d333f] border-[#4b5563] text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#6d72fe] focus:border-[#6d72fe] transition duration-150";
const tagBaseClasses = "inline-flex items-center px-3 py-1 mr-2 mb-2 rounded-full text-sm font-medium bg-[#4f46e5] text-[#eef2ff]";
const tagRemoveClasses = "ml-2 cursor-pointer font-bold text-[#c7d2fe] hover:text-white";
const buttonPrimaryClasses = "w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#090a10] transition duration-150 ease-in-out transform hover:scale-[1.01]";

// --- Categories ---
const categories = [
    { value: 'web_dev', label: 'Web Development' },
    { value: 'graphic_design', label: 'Graphic Design' },
    { value: 'writing_translation', label: 'Writing & Translation' },
    { value: 'video_animation', label: 'Video & Animation' },
    { value: 'music_audio', label: 'Music & Audio' },
    { value: 'ai_services', label: 'AI Services' },
]

// --- Tips ---
const tips = [
    "Write a clear, compelling gig title (e.g. 'I will build a custom AI chatbot for your business').",
    "Describe exactly what you offer and what the client will get.",
    "Add relevant tags so your gig is easy to find.",
    "Use a high-quality cover image (no watermarks, no text overlays).",
    "Set realistic delivery times and revision limits.",
    "Offer multiple packages for more flexibility.",
    "Be honest about your skills and experience.",
    "Respond quickly to client messages for better ratings.",
]

// --- Image Upload Helpers ---
const getPlaceholderUrl = (index: number) => {
    const colors = [
        { bg: '2d333f', text: 'e5e7eb', label: 'Design' },
        { bg: '4b5563', text: 'e5e7eb', label: 'Code' },
        { bg: '6d72fe', text: 'ffffff', label: 'Brand' },
        { bg: '818cf8', text: 'ffffff', label: 'Concept' },
        { bg: '4f46e5', text: 'ffffff', label: 'Mockup' },
    ];
    const { bg, text, label } = colors[index % colors.length];
    const width = 300;
    const height = 200;
    return `https://placehold.co/${width}x${height}/${bg}/${text}?text=${label}+${index + 1}`;
};

// --- Image Manager Component ---
const ImageManager = ({ images, setImages, validationError, setValidationError }) => {
    const handleFileUpload = useCallback(async (e) => {
        if (images.length >= 5) {
            setValidationError("Maximum 5 images allowed.");
            return;
        }
        if (e.target.files.length > 0) {
            setValidationError(null);
            // For now, just preview. Real upload is handled on submit.
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            const newImage = {
                id: Date.now(),
                url,
                file,
                isCover: images.length === 0,
            };
            const updatedImages = images.map(img => ({ ...img, isCover: images.length === 0 ? true : img.isCover }));
            setImages([...updatedImages, newImage]);
            e.target.value = '';
        }
    }, [images, setImages, setValidationError]);

    const handleAction = useCallback((id, action) => {
        const index = images.findIndex(img => img.id === id);
        if (index === -1) return;
        let updatedImages = [...images];
        setValidationError(null);
        switch (action) {
            case 'set-cover':
                updatedImages = images.map(img => ({ ...img, isCover: img.id === id }));
                break;
            case 'move-up':
                if (index > 0) [updatedImages[index - 1], updatedImages[index]] = [updatedImages[index], updatedImages[index - 1]];
                break;
            case 'move-down':
                if (index < images.length - 1) [updatedImages[index + 1], updatedImages[index]] = [updatedImages[index], updatedImages[index + 1]];
                break;
            case 'delete':
                const wasCover = images[index].isCover;
                updatedImages.splice(index, 1);
                if (wasCover && updatedImages.length > 0) {
                    updatedImages[0].isCover = true;
                }
                break;
            default:
                return;
        }
        setImages(updatedImages);
    }, [images, setImages, setValidationError]);

    return (
        <div className="border-t border-gray-600 pt-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Gig Image Gallery Management</h2>
            <p className="text-sm text-gray-400 mb-4">Upload up to 5 images. The one marked as <b>Cover</b> will be the main image on the browse page.</p>
            {validationError && (
                <div className="p-4 mb-4 bg-red-700 text-white rounded-lg">
                    {validationError}
                </div>
            )}
            <div className="mb-4">
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-1">Upload New Image</label>
                <input type="file" id="image-upload" accept="image/*" onChange={handleFileUpload} className="w-full text-sm text-gray-300"/>
            </div>
            <div id="image-list-container" className="space-y-4">
                {images.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No images uploaded yet.</p>
                ) : (
                    images.map((img, index) => {
                        const isCover = img.isCover;
                        const isFirst = index === 0;
                        const isLast = index === images.length - 1;
                        return (
                            <div key={img.id} className="flex flex-col sm:flex-row items-center p-4 bg-[#2d333f] rounded-xl border border-gray-600 shadow-md">
                                <div className="flex-shrink-0 relative mb-4 sm:mb-0 sm:mr-6">
                                    <img src={img.url} alt={`Gig Image ${index + 1}`} className="w-28 h-16 object-cover rounded-lg border border-gray-500" />
                                    {isCover && <span className="absolute top-0 right-0 -mt-2 -mr-2 px-2 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded-full shadow-lg">COVER</span>}
                                </div>
                                <div className="flex-grow text-sm text-gray-300 w-full sm:w-auto">
                                    <p className="font-medium">Image {index + 1}</p>
                                </div>
                                <div className="flex space-x-2 mt-4 sm:mt-0 sm:ml-auto flex-wrap justify-center">
                                    <button type="button" onClick={() => handleAction(img.id, 'set-cover')}
                                        className={`py-2 px-3 text-xs font-medium rounded-lg transition duration-150 ${isCover ? 'bg-indigo-700 text-white cursor-default' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}>
                                        {isCover ? 'Is Cover' : 'Set as Cover'}
                                    </button>
                                    <button type="button" onClick={() => handleAction(img.id, 'move-up')} disabled={isFirst}
                                        className={`py-2 px-3 text-xs font-medium rounded-lg transition duration-150 ${isFirst ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-400 text-white'}`}>
                                        Move Up
                                    </button>
                                    <button type="button" onClick={() => handleAction(img.id, 'move-down')} disabled={isLast}
                                        className={`py-2 px-3 text-xs font-medium rounded-lg transition duration-150 ${isLast ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-400 text-white'}`}>
                                        Move Down
                                    </button>
                                    <button type="button" onClick={() => handleAction(img.id, 'delete')}
                                        className="py-2 px-3 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition duration-150">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// --- Main Page ---
export default function PostGigPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        'gig-title': '',
        description: '',
        category: categories[0].value,
        price: '',
        'delivery-days': '',
        revisions: '3',
    });
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [images, setImages] = useState<any[]>([]);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [imageValidationError, setImageValidationError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [accessError, setAccessError] = useState('');

    // --- Freelancer Access Check ---
    useEffect(() => {
        async function checkFreelancer() {
            setChecking(true);
            setAccessError('');
            const supabase = createSupabaseBrowser();
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                setAccessError('You must be logged in to post a gig.');
                setChecking(false);
                setTimeout(() => router.replace('/account'), 2000);
                return;
            }
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_freelancer')
                .eq('id', user.id)
                .single();
            if (profileError || !profile) {
                setAccessError('Could not load your profile.');
                setChecking(false);
                setTimeout(() => router.replace('/account'), 2000);
                return;
            }
            if (!profile.is_freelancer) {
                setAccessError('Only freelancers can post gigs. Enable freelancer mode in your account settings.');
                setChecking(false);
                setTimeout(() => router.replace('/account/settings'), 2500);
                return;
            }
            setChecking(false);
        }
        checkFreelancer();
        // eslint-disable-next-line
    }, []);

    // --- Tag Handlers ---
    const handleTagInputChange = useCallback((e) => setTagInput(e.target.value), []);
    const handleTagAdd = useCallback((e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag) && tags.length < 10) {
                setTags(prev => [...prev, newTag]);
                setTagInput('');
            }
        }
    }, [tagInput, tags]);
    const handleTagRemove = useCallback((tagToRemove) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
    }, []);

    // --- Form Change Handler ---
    const handleChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    }, []);

    // --- Submit Handler ---
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMessage(false);
        setLoading(true);

        // Validation
        if (!formData['gig-title'] || !formData.description || !formData.price || !formData['delivery-days']) {
            setErrorMsg('Please fill in all required fields.');
            setLoading(false);
            return;
        }
        if (images.length === 0) {
            setImageValidationError("Please upload at least one image for your gig.");
            setLoading(false);
            return;
        }

        try {
            // Get user
            const supabase = createSupabaseBrowser();
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                setErrorMsg('Could not get your user info. Please log in again.');
                setLoading(false);
                return;
            }

            // --- Upload Images to Supabase Storage ---
            // Find cover image
            const coverImg = images.find(img => img.isCover) || images[0];
            let cover_image_url = '';
            let media_urls: string[] = [];
            // Upload cover
            if (coverImg.file) {
                const fileName = `cover_${Date.now()}_${coverImg.file.name}`;
                const { error } = await supabase.storage.from('gig-media').upload(fileName, coverImg.file, { upsert: true });
                if (error) throw error;
                const { data: urlData } = supabase.storage.from('gig-media').getPublicUrl(fileName);
                cover_image_url = urlData.publicUrl;
            } else {
                cover_image_url = coverImg.url;
            }
            // Upload gallery images
            for (const img of images) {
                if (img === coverImg) continue;
                if (img.file) {
                    const fileName = `media_${Date.now()}_${img.file.name}`;
                    const { error } = await supabase.storage.from('gig-media').upload(fileName, img.file, { upsert: true });
                    if (error) throw error;
                    const { data: urlData } = supabase.storage.from('gig-media').getPublicUrl(fileName);
                    media_urls.push(urlData.publicUrl);
                } else {
                    media_urls.push(img.url);
                }
            }

            // --- Insert Gig ---
            const slug = formData['gig-title'].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const { data: gigData, error: gigError } = await supabase
                .from('gigs')
                .insert([{
                    title: formData['gig-title'],
                    slug,
                    category: formData.category,
                    description: formData.description,
                    tags,
                    cover_image_url,
                    media_urls,
                    price_cents: Number(formData.price) * 100,
                    delivery_time_days: Number(formData['delivery-days']),
                    revisions: formData.revisions,
                    seller_id: user.id,
                }])
                .select()
                .single();
            if (gigError) throw gigError;

            setSuccessMessage(true);
            setTimeout(() => router.push(`/seller/gigs/${slug}`), 1200);
        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to post gig. Please try again.');
        }
        setLoading(false);
    }, [formData, tags, images, router]);

    // --- Loading/Access States ---
    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#090a10]">
                <div className="text-blue-400 text-lg font-semibold animate-pulse">Checking access...</div>
            </div>
        )
    }
    if (accessError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#090a10]">
                <div className="text-red-400 text-lg font-semibold">{accessError}</div>
            </div>
        )
    }

    // --- Render ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#090a10] p-4 sm:p-8">
            <div className="w-full max-w-4xl bg-[#1a1e27] p-6 sm:p-10 rounded-2xl shadow-2xl transition duration-300 ease-in-out border border-[#374151]">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-6 text-center">Post Your New Gig</h1>
                <p className="text-gray-400 mb-8 text-center">Fill out the details below to create a compelling service offering.</p>
                <ul className="mb-8 bg-blue-950/40 border border-blue-900 rounded-xl p-4 text-sm text-blue-200 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Gig Title */}
                    <div>
                        <label htmlFor="gig-title" className="block text-sm font-medium text-gray-300 mb-1">Gig Title <span className="text-red-400">*</span></label>
                        <input type="text" id="gig-title" required value={formData['gig-title']} onChange={handleChange}
                            className={inputClasses}
                            placeholder="I will design a modern, responsive website using React and Tailwind" />
                        <div className="text-xs text-blue-300 mt-1">{formData['gig-title'].length}/80 characters</div>
                    </div>
                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description <span className="text-red-400">*</span></label>
                        <textarea id="description" rows={5} required value={formData.description} onChange={handleChange}
                            className={inputClasses}
                            placeholder="Provide a detailed description of what your gig offers, what makes it unique, and what the buyer will receive."></textarea>
                        <div className="text-xs text-blue-300 mt-1">{formData.description.length}/1200 characters</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category <span className="text-red-400">*</span></label>
                            <select id="category" required value={formData.category} onChange={handleChange}
                                className={`${inputClasses} appearance-none`}>
                                <option value="" disabled>Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        {/* Starting Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Starting Price ($) <span className="text-red-400">*</span></label>
                            <input type="number" id="price" min="5" required value={formData.price} onChange={handleChange}
                                className={inputClasses}
                                placeholder="e.g., 50" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Delivery Time */}
                        <div>
                            <label htmlFor="delivery-days" className="block text-sm font-medium text-gray-300 mb-1">Delivery Time (Days) <span className="text-red-400">*</span></label>
                            <input type="number" id="delivery-days" min="1" required value={formData['delivery-days']} onChange={handleChange}
                                className={inputClasses}
                                placeholder="e.g., 3" />
                        </div>
                        {/* Revisions */}
                        <div>
                            <label htmlFor="revisions" className="block text-sm font-medium text-gray-300 mb-1">Revisions Offered</label>
                            <select id="revisions" value={formData.revisions} onChange={handleChange}
                                className={`${inputClasses} appearance-none`}>
                                <option value="1">1 Revision</option>
                                <option value="3">3 Revisions</option>
                                <option value="5">5 Revisions</option>
                                <option value="unlimited">Unlimited Revisions</option>
                            </select>
                        </div>
                    </div>
                    {/* Skills/Tags Input */}
                    <div>
                        <label htmlFor="skills-input" className="block text-sm font-medium text-gray-300 mb-1">Skills & Tools (Press Enter to add tags)</label>
                        <div id="tags-container" className="flex flex-wrap items-center min-h-12 p-3 border rounded-xl shadow-inner bg-[#2d333f] border-[#4b5563] mb-2">
                            {tags.map(tag => (
                                <div key={tag} className={tagBaseClasses}>
                                    <span>{tag}</span>
                                    <span onClick={() => handleTagRemove(tag)} className={tagRemoveClasses}>&times;</span>
                                </div>
                            ))}
                        </div>
                        <input type="text" id="skills-input" value={tagInput} onChange={handleTagInputChange} onKeyDown={handleTagAdd}
                            className={inputClasses}
                            placeholder="e.g., React, Figma, Python, SEO" />
                    </div>
                    {/* Image Gallery Management Component */}
                    <ImageManager
                        images={images}
                        setImages={setImages}
                        validationError={imageValidationError}
                        setValidationError={setImageValidationError}
                    />
                    {/* Submit Button */}
                    <div>
                        <button type="submit" className={buttonPrimaryClasses} disabled={loading}>
                            {loading ? 'Publishing...' : 'Publish Gig'}
                        </button>
                        {errorMsg && <div className="text-red-400 bg-red-900/40 p-2 rounded mt-2">{errorMsg}</div>}
                        {successMessage && <div className="text-green-400 bg-green-900/40 p-2 rounded mt-2">Gig posted successfully! Redirecting...</div>}
                    </div>
                </form>
            </div>
        </div>
    );
}
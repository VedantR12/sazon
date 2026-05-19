"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { useSelectedVendorStore } from "../store/selected-vendor-store";

export default function VendorModal() {
    const {
        selectedVendor,
        setSelectedVendor,
    } = useSelectedVendorStore();

    const supabase = createClient();

    const [reviews, setReviews] =
        useState<any[]>([]);

    const [
        showReviewForm,
        setShowReviewForm,
    ] = useState(false);

    const [rating, setRating] =
        useState(5);

    const [reviewText, setReviewText] =
        useState("");

    const [reviewImage, setReviewImage] =
        useState<File | null>(null);

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        if (!selectedVendor) return;

        const fetchReviews =
            async () => {

                const { data, error } =
                    await supabase
                        .from("reviews")
                        .select("*")
                        .eq(
                            "vendor_id",
                            selectedVendor.id
                        )
                        .order(
                            "created_at",
                            {
                                ascending: false,
                            }
                        );

                if (error) {
                    console.error(error);
                    return;
                }

                setReviews(data || []);
            };

        fetchReviews();

    }, [selectedVendor, supabase]);

    const submitReview =
        async () => {

            setLoading(true);

            if (!selectedVendor) {

                setLoading(false);

                return;
            }

            try {

                const {
                    data: { user },
                } =
                    await supabase.auth.getUser();

                if (!user) {

                    alert("Login required");

                    setLoading(false);

                    return;
                }

                if (!reviewText.trim()) {

                    alert(
                        "Please write a review"
                    );

                    setLoading(false);

                    return;
                }

                let image_url = null;

                // IMAGE UPLOAD

                if (reviewImage) {

                    const filePath =
                        `${Date.now()}-${reviewImage.name}`;

                    const {
                        error: uploadError,
                    } =
                        await supabase.storage
                            .from(
                                "review-images"
                            )
                            .upload(
                                filePath,
                                reviewImage
                            );

                    if (uploadError) {
                        throw uploadError;
                    }

                    const { data } =
                        supabase.storage
                            .from(
                                "review-images"
                            )
                            .getPublicUrl(
                                filePath
                            );

                    image_url =
                        data.publicUrl;
                }

                // INSERT REVIEW

                const {
                    error: reviewError,
                } =
                    await supabase
                        .from("reviews")
                        .insert({
                            vendor_id:
                                selectedVendor.id,

                            user_id:
                                user.id,

                            rating,

                            review_text:
                                reviewText,

                            image_url,
                        });

                if (reviewError) {
                    throw reviewError;
                }

                // FETCH UPDATED REVIEWS

                const {
                    data: updatedReviews,
                } =
                    await supabase
                        .from("reviews")
                        .select("rating")
                        .eq(
                            "vendor_id",
                            selectedVendor.id
                        );

                // CALCULATE AVERAGE

                const total =
                    updatedReviews?.reduce(
                        (
                            sum,
                            review
                        ) =>
                            sum +
                            review.rating,
                        0
                    ) || 0;

                const avg =
                    updatedReviews?.length
                        ? total /
                        updatedReviews.length
                        : 0;

                // UPDATE VENDOR

                // UPDATE VENDOR

                await supabase
                    .from("vendors")
                    .update({
                        rating:
                            Number(
                                avg.toFixed(1)
                            ),

                        review_count:
                            updatedReviews?.length ||
                            0,
                    })
                    .eq(
                        "id",
                        selectedVendor.id
                    );

                // FETCH UPDATED VENDOR

                const {
                    data: updatedVendor,
                } = await supabase
                    .from("vendors")
                    .select("*")
                    .eq(
                        "id",
                        selectedVendor.id
                    )
                    .single();

                if (updatedVendor) {

                    setSelectedVendor(
                        updatedVendor
                    );
                }

                // REFRESH REVIEWS

                const {
                    data: freshReviews,
                } =
                    await supabase
                        .from("reviews")
                        .select("*")
                        .eq(
                            "vendor_id",
                            selectedVendor.id
                        )
                        .order(
                            "created_at",
                            {
                                ascending: false,
                            }
                        );

                setReviews(
                    freshReviews || []
                );

                // RESET FORM

                setRating(5);

                setReviewText("");

                setReviewImage(null);

                setShowReviewForm(false);

                alert(
                    "Review added"
                );

            } catch (error) {

                console.error(error);

                alert(
                    "Failed to submit review"
                );

            } finally {

                setLoading(false);
            }
        };

    if (!selectedVendor) return null;

    return (
        <div
            onClick={() =>
                setSelectedVendor(null)
            }
            style={{
                position: "fixed",
                inset: 0,
                background:
                    "rgba(0,0,0,0.28)",

                backdropFilter: "blur(12px)",

                WebkitBackdropFilter:
                    "blur(12px)",
                zIndex: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                onClick={(e) =>
                    e.stopPropagation()
                }
                style={{
                    width: "100%",
                    maxWidth: 500,
                    height: "80vh",
                    boxShadow:
                        "0 25px 80px rgba(0,0,0,0.35)",
                    paddingBottom: 24,
                    background: "#fcfcfc",
                    borderRadius: 32,
                    overflow: "hidden",
                    overflowY: "auto",
                }}
            >


                <div
                    style={{
                        height: 320,
                        background: "#f3f3f3",

                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",

                            top: 14,

                            left: "50%",

                            transform: "translateX(-50%)",

                            width: 50,

                            height: 5,

                            background:
                                "rgba(255,255,255,0.7)",

                            borderRadius: 999,

                            zIndex: 2,
                        }}
                    />
                    {selectedVendor.image_url ? (
                        <>
                            <img
                                src={
                                    selectedVendor.image_url
                                }
                                alt={
                                    selectedVendor.name
                                }
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />

                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(to top, rgba(0,0,0,0.28), transparent)",
                                }}
                            />
                        </>
                    ) : null}
                </div>

                <div
                    style={{
                        padding: 20,
                    }}
                >
                    <div
                        style={{
                            fontSize: 30,
                            fontWeight: 800,
                        }}
                    >
                        🔥{" "}
                        {
                            selectedVendor.best_item
                        }
                    </div>

                    <div
                        style={{
                            marginTop: 8,
                            opacity: 0.7,
                        }}
                    >
                        {selectedVendor.name}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 18,
                        }}
                    >

                        {/* STARS */}

                        <div
                            style={{
                                color: "#facc15",
                                fontSize: 18,
                            }}
                        >

                            {"★".repeat(
                                Math.round(
                                    selectedVendor.rating || 0
                                )
                            )}

                        </div>

                        {/* RATING + REVIEW COUNT */}

                        <div
                            style={{
                                opacity: 0.7,
                            }}
                        >

                            {selectedVendor.rating || 0}

                            {" • "}

                            {selectedVendor.review_count || 0}

                            {" reviews"}

                        </div>

                    </div>

                    <div
                        style={{
                            marginTop: 24,
                            lineHeight: 1.7,
                        }}
                    >
                        📍{" "}
                        {selectedVendor.address}
                    </div>

                    <div
                        style={{
                            marginTop: 12,
                            lineHeight: 1.7,
                        }}
                    >
                        📞{" "}
                        {selectedVendor.phone}
                    </div>
                    <div
                        style={{
                            marginTop: 40,
                            borderTop:
                                "1px solid rgba(0,0,0,0.08)",
                            paddingTop: 28,
                        }}
                    >

                        {/* REVIEWS TITLE */}

                        <div
                            style={{
                                fontSize: 26,
                                fontWeight: 800,
                                marginBottom: 24,
                            }}
                        >
                            Reviews
                        </div>

                        {/* STAR SELECTOR */}

                        <div
                            style={{
                                marginBottom: 24,
                            }}
                        >

                            <div
                                style={{
                                    fontSize: 14,
                                    opacity: 0.6,
                                    marginBottom: 10,
                                }}
                            >
                                Your Rating
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 8,
                                }}
                            >

                                {[1, 2, 3, 4, 5].map(
                                    (star) => (

                                        <button
                                            key={star}
                                            onClick={() => {

                                                setRating(star);

                                                setShowReviewForm(true);
                                            }}
                                            style={{
                                                border: "none",
                                                background:
                                                    "transparent",
                                                cursor: "pointer",
                                                fontSize: 34,
                                                color:
                                                    star <= rating
                                                        ? "#facc15"
                                                        : "#d1d5db",
                                                transition:
                                                    "0.2s",
                                            }}
                                        >
                                            ★
                                        </button>
                                    )
                                )}

                            </div>

                        </div>

                        {!showReviewForm && (

                            <button
                                onClick={() =>
                                    setShowReviewForm(true)
                                }
                                style={{
                                    border: "none",
                                    background: "black",
                                    color: "white",
                                    padding:
                                        "14px 22px",
                                    borderRadius: 18,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    marginBottom: 24,
                                }}
                            >
                                Write a Review
                            </button>
                        )}

                        {showReviewForm && (

                            <>

                                {/* REVIEW TEXTAREA */}

                                <textarea
                                    value={reviewText}
                                    onChange={(e) =>
                                        setReviewText(
                                            e.target.value
                                        )
                                    }
                                    placeholder={`Write your experience...
How was the food?
Would you recommend it?`}
                                    style={{
                                        width: "100%",
                                        minHeight: 140,
                                        border:
                                            "1px solid rgba(0,0,0,0.12)",
                                        borderRadius: 18,
                                        padding: 16,
                                        resize: "none",
                                        outline: "none",
                                        fontSize: 15,
                                        marginBottom: 20,
                                    }}
                                />

                                {/* IMAGE INPUT */}

                                <div
                                    style={{
                                        marginBottom: 20,
                                    }}
                                >

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setReviewImage(
                                                e.target.files?.[0] ||
                                                null
                                            )
                                        }
                                    />

                                </div>

                                {/* SUBMIT BUTTON */}

                                <button
                                    onClick={submitReview}
                                    disabled={loading}
                                    style={{
                                        border: "none",
                                        background: "black",
                                        color: "white",
                                        padding:
                                            "14px 22px",
                                        borderRadius: 18,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        opacity:
                                            loading ? 0.6 : 1,
                                    }}
                                >

                                    {loading
                                        ? "Submitting..."
                                        : "Submit Review"}

                                </button>

                            </>

                        )}

                        {/* REVIEWS LIST */}

                        <div
                            style={{
                                marginTop: 40,
                                display: "flex",
                                flexDirection: "column",
                                gap: 20,
                            }}
                        >

                            {reviews.map((review) => (

                                <div
                                    key={review.id}
                                    style={{
                                        border:
                                            "1px solid rgba(0,0,0,0.08)",
                                        borderRadius: 20,
                                        padding: 18,
                                    }}
                                >

                                    {/* HEADER */}

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            marginBottom: 14,
                                        }}
                                    >

                                        {/* REVIEW STARS */}

                                        <div
                                            style={{
                                                color: "#facc15",
                                                fontSize: 18,
                                            }}
                                        >

                                            {Array.from({ length: 5 }).map(
                                                (_, index) => (

                                                    <span key={index}>

                                                        {index < review.rating
                                                            ? "★"
                                                            : "☆"}

                                                    </span>
                                                )
                                            )}

                                        </div>

                                        {/* DATE */}

                                        <div
                                            style={{
                                                fontSize: 13,
                                                opacity: 0.6,
                                            }}
                                        >

                                            {new Date(
                                                review.created_at
                                            ).toLocaleDateString()}

                                        </div>

                                    </div>

                                    {/* REVIEW TEXT */}

                                    {review.review_text && (

                                        <div
                                            style={{
                                                lineHeight: 1.7,
                                            }}
                                        >

                                            {review.review_text}

                                        </div>
                                    )}

                                    {/* REVIEW IMAGE */}

                                    {review.image_url && (

                                        <img
                                            src={
                                                review.image_url
                                            }
                                            alt="Review"
                                            style={{
                                                width: "100%",
                                                marginTop: 16,
                                                borderRadius: 18,
                                                maxHeight: 300,
                                                objectFit:
                                                    "cover",
                                            }}
                                        />
                                    )}

                                </div>

                            ))}

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
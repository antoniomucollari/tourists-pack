import CarouselClient from "@/components/DisplayingPackets/CarouselClient";
import Product from "@/domain/Product";


async function getPacks(): Promise<Product[]> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/products/all?type=PACKET`,
        {
            cache: "no-store", 
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }

    const result = await response.json();
    return result.data;
}

export default async function Carousel() {
    let product: Product[] = [];
    let errorMessage = "An unknown error occurred"; // Default message

    try {
        product = await getPacks();
    } catch (error: unknown) {
        // Check if the error is an object with a message property
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        return (
            <section>
                <h2 className="section-title color-red">Error: {errorMessage}</h2>
            </section>
        );
    }
    return (
        <CarouselClient product={product} />
    );
}

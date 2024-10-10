import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    centerCrop,
    convertToPixelCrop,
    convertToPercentCrop,
    Crop,
    makeAspectCrop,
    ReactCrop,
} from "react-image-crop";
import "react-image-crop/src/ReactCrop.scss";

function getImageDimensions(src: string) {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new window.Image();

        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = reject;
        img.src = src;
    });
}

export const AvatarTuner = ({
    imageSrc,
    onSave,
}: {
    imageSrc: string;
    onSave: (crop: Crop) => void;
}) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    }>({
        width: 0,
        height: 0,
    });
    const [crop, setCrop] = useState<Crop>({
        height: 0,
        unit: "px",
        width: 0,
        x: 0,
        y: 0,
    });

    useEffect(() => {
        getImageDimensions(imageSrc).then(({ width, height }) => {
            const defaultCrop = centerCrop(
                makeAspectCrop(
                    {
                        // You don't need to pass a complete crop into
                        // makeAspectCrop or centerCrop.
                        unit: "%",
                        width: 90,
                    },
                    1,
                    width,
                    height
                ),
                width,
                height
            );
            setCrop(defaultCrop);
            setDimensions({ width, height });
        });
    }, [imageSrc]);

    return (
        <div className="flex flex-col gap-4">
            <ReactCrop
                aspect={1}
                keepSelection
                circularCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                minWidth={200}
                minHeight={200}
            >
                <img
                    ref={imgRef}
                    // width={1000}
                    // height={1000}
                    src={imageSrc}
                    alt="avatar"
                />
            </ReactCrop>
            <Button
                variant="default"
                onClick={() =>
                    onSave(
                        convertToPixelCrop(
                            convertToPercentCrop(
                                crop,
                                imgRef.current?.width ?? 0,
                                imgRef.current?.height ?? 0
                            ),
                            dimensions.width,
                            dimensions.height
                        )
                    )
                }
            >
                <Scan className="mr-2" />
                <span>Crop</span>
            </Button>
        </div>
    );
};

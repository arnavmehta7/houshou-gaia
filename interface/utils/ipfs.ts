/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function uploadImgToIPFS(_img: any) {
    console.log("uploading to ipfs...");
    const formData = new FormData();
    
    const pinataMetadata = JSON.stringify({
        name: "Form-logo",
    });
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    });
    
    formData.append("file", _img);
    formData.append("pinataMetadata", pinataMetadata);
    formData.append("pinataOptions", pinataOptions);

    const key = process.env.NEXT_PUBLIC_PINATA_API;

    const request = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${key}`,
            },
            body: formData,
        }
    );
    const response = await request.json();
    // console.log(response);
    return response.IpfsHash;
}

async function uploadFormToIPFS(data: any) {
    const formData = new FormData();

    const file = new File([data], "Action.txt", {
        type: "text/plain",
    });
    const pinataMetadata = JSON.stringify({
        name: "Metadata",
    });
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    });

    formData.append("file", file);
    formData.append("pinataMetadata", pinataMetadata);
    formData.append("pinataOptions", pinataOptions);

    const key = process.env.NEXT_PUBLIC_PINATA_API;

    const request = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${key}`,
            },
            body: formData,
        }
    );
    const response = await request.json();
    const dedicatedGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;
    console.log("ipfs: ", `https://${dedicatedGateway}/ipfs/${response.IpfsHash}`);
    return `https://${dedicatedGateway}/ipfs/${response.IpfsHash}`;
}

export async function uploadForm(formInput: any) {
    console.log("uploading to ipfs...");
    const { pool, duration, name, description1, description2, description3, description4, image }= formInput;
    if (!pool || !name || !duration || !description1 || !image) return;
    const formData1 = JSON.stringify({ pool, name, duration, description1, image });

    let finalObject = {}
    const formUri1 = await uploadFormToIPFS(formData1);
    finalObject = {...finalObject, formUri1}

    if (description2 !== "") {
        const formData2 = JSON.stringify({ pool, name, duration, description2, image });
        const formUri2 = await uploadFormToIPFS(formData2);
        finalObject = {...finalObject, formUri2}
    }

    if (description3 !== "") {
        const formData3 = JSON.stringify({ pool, name, duration, description3, image });
        const formUri3 = await uploadFormToIPFS(formData3);
        finalObject = {...finalObject, formUri3}
    }

    if (description4 !== "") {
        const formData4 = JSON.stringify({ pool, name, duration, description4, image });
        const formUri4 = await uploadFormToIPFS(formData4);
        finalObject = {...finalObject, formUri4}
    }

    const finalData = JSON.stringify(finalObject);
    const resultUri = await uploadFormToIPFS(finalData);
    return resultUri;
}
interface Duck {
    name :string;
    nomor: number;
    makeSound : (sound:string) => void;
}

const duck1 : Duck = {
    name :"okta daffa ramadani",
    nomor : 12,
    makeSound: (sound) => console.log(sound)
}




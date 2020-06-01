import React, {useEffect, useState, useRef, useCallback} from "react";
import axios from 'axios';
import {Row,Container} from "react-bootstrap";
import "./App.css"


const App = () => {
    const [cards, setCards] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedClass, setSelectedClass] =useState("");
    const [type, setType] = useState("");
    const [minionType, setMinionType] = useState("");
    const [rarity, setRarity] =useState("");
    const [pageNumber , setPageNumber] = useState(1)
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true)

    const observer = useRef();


    const flatten = (arr) => {
        let flatArray = [];

        arr.forEach(element => {
            if(Array.isArray(element)) {
                flatArray = flatArray.concat(flatten(element));
            } else {
                flatArray.push(element);
            }
        })

        return flatArray;
    }

    const lastCardElementRef = useCallback((node) => {
        if (loading) return
        if (!hasMore) return
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    },[hasMore])

    useEffect(() => {
        setPageNumber(1)
        setCards([]);
        axios.get("https://us.api.blizzard.com//hearthstone/cards?locale=en_US&page=&textFilter="+ search +"&set=&rarity="+rarity+"&minionType="+minionType+"&type="+type+"&class="+selectedClass+"&access_token=USzYeJcZP6n0NMweKhedqNmKni94PvLZrv")
            .then((res) => {
                const resArr = flatten(res.data.cards);
                setCards(resArr);
            })
        setLoading(false)
    },[search,selectedClass,rarity,minionType,type])


    useEffect(() =>  {
        axios.get("https://us.api.blizzard.com//hearthstone/cards?locale=en_US&page="+pageNumber+"&textFilter="+ search +"&set=&rarity="+rarity+"&minionType="+minionType+"&type="+type+"&class="+selectedClass+"&access_token=USzYeJcZP6n0NMweKhedqNmKni94PvLZrv")
            .then((res) => {
               if (res.data.pageCount ===  res.data.page) return
                const resArr = res.data.cards;
                setCards((prevCards) => {
                    return flatten([...prevCards, resArr]);
                });
                setHasMore(res.data.pageCount >  res.data.page)
            })
    },[pageNumber])


    return (
        <div className={"app"}>
            <header className={"header"}>
                <div className={"header-content"}>
                    <div className={'logo'}>
                        <img  src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Hearthstone_2016_logo.png/220px-Hearthstone_2016_logo.png" alt=""/>
                    </div>
                    <div className={'filter'}>
                        <input type="text" placeholder={"Search"} onKeyDown={(e)  =>  {
                            if(e.key === "Enter") {
                                setSearch(e.target.value)
                            }
                        }}/>
                        <select name="" id="" onChange={(e) => {e.persist(); setSelectedClass(e.target.value)}}>
                            <option value="">All Classes</option>
                            <option value="demonhunter">Demon Hunter</option>
                            <option value="druid">Druid</option>
                            <option value="hunter">Hunter</option>
                            <option value="mage">Mage</option>
                            <option value="paladin">Paladin</option>
                            <option value="priest">Priest</option>
                            <option value="rogue">Rogue</option>
                            <option value="shaman">Shaman</option>
                            <option value="warlock">Warlock</option>
                            <option value="warrior">Warrior</option>
                        </select>
                        <select name="" id="" onChange={(e) => {e.persist(); setRarity(e.target.value)}}>
                            <option value="">All Rarity</option>
                            <option value="free">Free</option>
                            <option value="common">Common</option>
                            <option value="rare">Rare</option>
                            <option value="epic">Epic</option>
                            <option value="legendary">Legendary</option>
                        </select>
                        <select name="" id="" onChange={(e) => {e.persist(); setMinionType(e.target.value)}}>
                            <option value="">All Minion Type</option>
                            <option value="beast">Beast</option>
                            <option value="demon">Demon</option>
                            <option value="dragon">Dragon</option>
                            <option value="elemental">Elemental</option>
                            <option value="mech">Mech</option>
                            <option value="murloc">Murloc</option>
                            <option value="pirate">Pirate</option>
                            <option value="totem">Totem</option>
                            <option value="general">General</option>
                        </select>
                        <select name="" id="" onChange={(e) => {e.persist(); setType(e.target.value); setPageNumber(1)}}>
                            <option value="">All Card Type</option>
                            <option value="hero">Hero</option>
                            <option value="minion">Minon</option>
                            <option value="spell">Spell</option>
                            <option value="weapon">Weapon</option>
                        </select>

                    </div>
                </div>
            </header>
            <Container>
                {!loading ? (
                    <Row lg={4}>
                        {cards.map ((card, index) => {
                            if (cards.length === index + 1) {
                                return <img key={index}  ref={lastCardElementRef} className={"grow"} src={card.image} alt="" />
                            }else {
                                return <img key={index} className={"grow"} src={card.image} alt="" />
                            }
                        })}
                        </Row>
                ) : (null)}
            </Container>
        </div>
    )
}

export default  App;
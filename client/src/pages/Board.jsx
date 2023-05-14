import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import boardApi from "../api/boardApi";
import { Box, IconButton, TextField, Typography, Button, Divider } from "@mui/material";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EmojiPicker from "../components/common/EmojiPicker";
import { useDispatch, useSelector } from 'react-redux'
import { setBoards } from '../redux/features/boardSlice'

let timer
const timeout = 500

const Board = () => {
  const dispatch = useDispatch()
  const { boardId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [icon, setIcon] = useState("");

  const boards = useSelector((state) => state.board.value)

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId);
        setTitle(res.title);
        setDescription(res.description);
        setSections(res.sections);
        setIsFavourite(res.favourite);
        setIcon(res.icon);
        // console.log(res)
      } catch (err) {
        // alert(err);
        console.log(err)
      }
    };
    getBoard();
  }, [boardId]);

  const onIconChange = async (newIcon) => {
    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], icon: newIcon }

    // if (isFavourite) {
    //   let tempFavourite = [...favouriteList]
    //   const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
    //   tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon }
    //   dispatch(setFavouriteList(tempFavourite))
    // }

    setIcon(newIcon)
    dispatch(setBoards(temp))
    try {
      await boardApi.update(boardId, { icon: newIcon })
    } catch (err) {
      console.log(err)

    }
  }

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    setTitle(newTitle)

    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], title: newTitle }

    // if (isFavourite) {
    //   let tempFavourite = [...favouriteList]
    //   const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
    //   tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle }
    //   dispatch(setFavouriteList(tempFavourite))
    // }

    dispatch(setBoards(temp))

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle })
      } catch (err) {
        alert(err)
      }
    }, timeout);
  }

  const updateDescription = async (e) => {
    clearTimeout(timer)
    const newDescription = e.target.value
    setDescription(newDescription)
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription })
      } catch (err) {
        alert(err)
      }
    }, timeout);
  }

  // const addFavourite = async () => {
  //   try {
  //     const board = await boardApi.update(boardId, { favourite: !isFavourite })
  //     let newFavouriteList = [...favouriteList]
  //     if (isFavourite) {
  //       newFavouriteList = newFavouriteList.filter(e => e.id !== boardId)
  //     } else {
  //       newFavouriteList.unshift(board)
  //     }
  //     dispatch(setFavouriteList(newFavouriteList))
  //     setIsFavourite(!isFavourite)
  //   } catch (err) {
  //     alert(err)
  //   }
  // }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <IconButton variant="outlined">
          {isFavourite ? (
            <StarOutlinedIcon color="warning" />
          ) : (
            <StarBorderOutlinedIcon />
          )}
        </IconButton>
        <IconButton variant="outlined" color="error">
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: "10px 50px" }}>
        <Box>
          {/* Emoji picker */}
          <EmojiPicker icon={icon} onChange={onIconChange} />
        </Box>
        <TextField
          value={title}
          onChange={updateTitle}
          placeholder="Untitled"
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0 },
            "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
            "& .MuiOutlinedInput-root": { fontSize: "2rem", fontWeight: "700" },
          }}
        />
        <TextField
          value={description}
          onChange={updateDescription}
          placeholder="Add a description"
          variant="outlined"
          multiline
          fullWidth
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0 },
            "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
            "& .MuiOutlinedInput-root": { fontSize: "0.8rem" },
          }}
        />
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button>Add section</Button>
            <Typography variant="body2" fontWeight="700">
              {sections.length} Sections
            </Typography>
          </Box>
          <Divider sx={{margin: '10px 0'}} />
          <Box>
          {/* Kanban board */}
          {/* <Kanban data={sections} boardId={boardId} /> */}
        </Box>
        </Box>
      </Box>
    </>
  );
};

export default Board;

package lt.povilass.jirap.service.impl;

import lt.povilass.jirap.itunes.ITunesService;
import lt.povilass.jirap.itunes.dto.ITunesArtistDto;
import lt.povilass.jirap.itunes.dto.ITunesArtistsDto;
import lt.povilass.jirap.rest.dto.ArtistDto;
import lt.povilass.jirap.rest.dto.ArtistsDto;
import lt.povilass.jirap.service.ArtistsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ArtistsServiceImpl implements ArtistsService {

    private static final Logger log = LoggerFactory.getLogger(ArtistsServiceImpl.class);

    private final ITunesService iTunesService;

    public ArtistsServiceImpl(ITunesService iTunesService) {
        this.iTunesService = iTunesService;
    }

    @Override
    public ArtistsDto getArtists(String searchParam) throws IOException {

        ITunesArtistsDto iTunesArtistsDto = iTunesService.getArtistsFromITunes(searchParam);

        return mapToArtistsDto(iTunesArtistsDto);
    }

    private ArtistsDto mapToArtistsDto(ITunesArtistsDto iTunesArtistsDto) {

        List<ArtistDto> artists = new ArrayList<>();
        for (ITunesArtistDto iTunesArtistDto : iTunesArtistsDto.getResults()) {
            ArtistDto artist = new ArtistDto();
            artist.setId(iTunesArtistDto.getArtistId());
            artist.setName(iTunesArtistDto.getArtistName());
            artist.setLink(iTunesArtistDto.getArtistLinkUrl());
            artist.setGenre(iTunesArtistDto.getPrimaryGenreName());
            artist.setGenreId(iTunesArtistDto.getPrimaryGenreId());

            artists.add(artist);
        }

        ArtistsDto artistsDto = new ArtistsDto();
        artistsDto.setArtists(artists);

        return artistsDto;
    }
}
